import requests, json
token = 'EAAUcCJJeKl4BQ16De7Sgi8zD8iovopgZCKoGQ2ZCRNF5aeY5zZBaSnvchfxBO5IWAFXt2ilZBZA7DpeSko25Xh6oJYKaST28IkXBJlZC4QpP9yDhUcomdpGzMhfzg3qhhAchujLk17DKbSo2EipjJaX16YEGk9KzlMYIZA9IrWZCOwQJUv364OqTib6hlngtHldoUa2WkHc9ePZBGC3gR1dQPXThMNVBWMSdSlglZBwC8jNGof5BGkeo1AZCtySAvNY4krgalVDvCxYWv5VU99hUdp48Wkqhxvh0SisJTowbyZAEQv7fCcmxJ0NSxHF5wSVAcNS7635P2UTBR0BE'
account_id = 'act_4102226916661284'
page_id = '167676264141990'
saved_audience_id = '120241621329650337'

# 1. Create Campaign
url_camp = f'https://graph.facebook.com/v19.0/{account_id}/campaigns'
payload_camp = {
    'name': '[ORFLIE VENDAS] Lead Gen B2B Sniper',
    'objective': 'OUTCOME_LEADS',
    'status': 'PAUSED',
    'special_ad_categories': '["NONE"]',
    'daily_budget': 3000,
    'access_token': token
}
res_camp = requests.post(url_camp, data=payload_camp).json()

with open('c:\\Users\\leo.cauchioli\\Desktop\\aios-core-main\\tmp\\create_result.json', 'w') as f:
    json.dump({'campaign': res_camp}, f, indent=2)

campaign_id = res_camp.get('id')
if campaign_id:
    # 2. Create Ad Set
    url_adset = f'https://graph.facebook.com/v19.0/{account_id}/adsets'
    payload_adset = {
        'name': 'CONJUNTO: B2B Gestores + Exclusão Sniper',
        'campaign_id': campaign_id,
        'status': 'PAUSED',
        'billing_event': 'IMPRESSIONS',
        'optimization_goal': 'LEAD_GENERATION',
        'promoted_object': json.dumps({"page_id": page_id}),
        'targeting': json.dumps({"saved_audience": {"id": saved_audience_id}}),
        'access_token': token
    }
    res_adset = requests.post(url_adset, data=payload_adset).json()
    
    with open('c:\\Users\\leo.cauchioli\\Desktop\\aios-core-main\\tmp\\create_result.json', 'w') as f:
        json.dump({'campaign': res_camp, 'adset': res_adset}, f, indent=2)
