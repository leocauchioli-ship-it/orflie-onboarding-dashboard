import requests, json

token = 'EAAUcCJJeKl4BQ16De7Sgi8zD8iovopgZCKoGQ2ZCRNF5aeY5zZBaSnvchfxBO5IWAFXt2ilZBZA7DpeSko25Xh6oJYKaST28IkXBJlZC4QpP9yDhUcomdpGzMhfzg3qhhAchujLk17DKbSo2EipjJaX16YEGk9KzlMYIZA9IrWZCOwQJUv364OqTib6hlngtHldoUa2WkHc9ePZBGC3gR1dQPXThMNVBWMSdSlglZBwC8jNGof5BGkeo1AZCtySAvNY4krgalVDvCxYWv5VU99hUdp48Wkqhxvh0SisJTowbyZAEQv7fCcmxJ0NSxHF5wSVAcNS7635P2UTBR0BE'
account_id = 'act_4102226916661284'
page_id = '167676264141990'
saved_audience_id = '120241621329650337'
campaign_id = '120241621378560337'

# 1. Obter a segmentação exata do Público Salvo
url_aud = f'https://graph.facebook.com/v19.0/{saved_audience_id}'
params_aud = {
    'access_token': token,
    'fields': 'targeting'
}
res_aud = requests.get(url_aud, params=params_aud).json()
targeting_data = res_aud.get('targeting', {})

# 2. Criar o Conjunto de Anúncios copiando o targeting do público salvo
url_adset = f'https://graph.facebook.com/v19.0/{account_id}/adsets'
payload_adset = {
    'name': '[CONJUNTO] B2B Gestores + Exclusão Sniper',
    'campaign_id': campaign_id,
    'status': 'PAUSED',
    'billing_event': 'IMPRESSIONS',
    'optimization_goal': 'LEAD_GENERATION',
    'promoted_object': json.dumps({"page_id": page_id}),
    'targeting': json.dumps(targeting_data),
    'access_token': token
}

res_adset = requests.post(url_adset, data=payload_adset).json()

with open('c:\\Users\\leo.cauchioli\\Desktop\\aios-core-main\\tmp\\create_adset_final_ok.json', 'w') as f:
    json.dump(res_adset, f, indent=2)
