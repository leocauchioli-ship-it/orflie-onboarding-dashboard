import { NextResponse } from 'next/server'
import { google } from 'googleapis'

// Configurar credenciais via variável de ambiente
const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_ID!
const SHEET_NAME = process.env.GOOGLE_SHEETS_NAME || 'Respostas'

export async function GET() {
  console.log('API /api/sheets chamada')
  try {
    if (!SPREADSHEET_ID) {
      console.error('SPREADSHEET_ID não encontrado no processo')
      return NextResponse.json({ error: 'SPREADSHEET_ID não configurado' }, { status: 500 })
    }

    console.log('Autenticando com Google Sheets...', process.env.GOOGLE_CLIENT_EMAIL)
    
    // Autenticação via Service Account
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
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

    return NextResponse.json(data)
  } catch (error) {
    console.error('Erro ao buscar dados:', error)
    return NextResponse.json({ error: 'Erro ao buscar dados' }, { status: 500 })
  }
}