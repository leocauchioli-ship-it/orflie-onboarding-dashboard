import { NextResponse } from 'next/server'
import { google } from 'googleapis'

// Força execução dinâmica a cada request — nunca cacheia
export const dynamic = 'force-dynamic'
export const revalidate = 0

// Configurar credenciais via variável de ambiente
const SPREADSHEET_ID = (process.env.GOOGLE_SHEETS_ID || '').trim()
const SHEET_NAME = (process.env.GOOGLE_SHEETS_NAME || 'Respostas').trim()

export async function GET() {
  console.log('API /api/sheets chamada')
  try {
    if (!SPREADSHEET_ID) {
      console.error('SPREADSHEET_ID não encontrado no processo')
      return NextResponse.json({ error: 'SPREADSHEET_ID não configurado' }, { status: 500 })
    }

    // Autenticação via Service Account — prioridade: B64 > JSON > email+chave
    let credentials: { client_email: string; private_key: string }

    if (process.env.GOOGLE_SERVICE_ACCOUNT_B64) {
      const json = Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT_B64, 'base64').toString('utf8')
      credentials = JSON.parse(json)
      console.log('Autenticando com Google Sheets via B64...', credentials.client_email)
    } else if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
      credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON)
      console.log('Autenticando com Google Sheets via JSON...', credentials.client_email)
    } else {
      credentials = {
        client_email: process.env.GOOGLE_CLIENT_EMAIL!,
        private_key: (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
      }
      console.log('Autenticando com Google Sheets...', credentials.client_email)
    }

    const auth = new google.auth.JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    })

const sheets = google.sheets({ version: 'v4', auth })

    console.log('Buscando dados da planilha:', SPREADSHEET_ID, 'aba:', SHEET_NAME)
    
    // Ler dados da planilha
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A2:Z`, // Ignora header
    })

    const rows = response.data.values || []
    console.log('Dados recebidos do Sheets:', rows.length, 'linhas')

    // Processar cada linha
    const data = rows.map((row: string[]) => {
      const receivedAt = row[0] || ''
      const companyName = row[1] || ''
      const contactName = row[2] || ''
      const contactEmail = row[3] || ''
      const contactPhone = row[4] || ''
      const companySegment = row[5] || ''
      const payloadJson = row[6] || '{}'

      // Parsear o JSON do payload
      let payload: Record<string, unknown> = {}
      try {
        payload = JSON.parse(payloadJson)
      } catch { payload = { raw: payloadJson } }

      return {
        receivedAt,
        companyName,
        contactName,
        contactEmail,
        contactPhone,
        companySegment,
        payload,
      }
    })

    // Ordenar por data (mais recente primeiro)
    data.sort((a, b) => {
      const parseDate = (d: string) => {
        if (!d) return 0;
        try {
          if (d.includes('/')) {
            const [datePart, timePart] = d.split(' ');
            const [day, month, year] = datePart.split('/');
            return new Date(`${year}-${month}-${day}T${timePart || '00:00:00'}`).getTime();
          }
          return new Date(d).getTime();
        } catch { return 0; }
      };
      return (parseDate(b.receivedAt as string) || 0) - (parseDate(a.receivedAt as string) || 0);
    })

    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' }
    })
  } catch (error) {
    const e = error as { message?: string; code?: number; status?: number; errors?: unknown[] }
    console.error('Erro ao buscar dados:', error)
    return NextResponse.json({
      error: 'Erro ao buscar dados',
      message: e.message,
      code: e.code,
      status: e.status,
      details: e.errors,
    }, { status: 500 })
  }
}