import requests, json

token = 'EAAUcCJJeKl4BQ9OdHQSHDwJ7Ellfj6NeI3G14GCZACVllOWWYR96uD4BSvTZBAUZA8TAHPfAA73fQmnXCsVFB0yIOoENjyUIaEnpaZBoMpOVU1g62RxJsRIZB2AnJZBZC2PFYyZAz54hGJOlg7ZBx7DRAK27ZBN2ZB0L3B0ZCc2uVuYf0PIwIp7ZC8D9oe8HpB6ZCbMvYSPGdGePpCwi2S45hjUXbL5KMVe1M23bHpxAH10hwxuGFBJQvEK97c18ocx2ydffjCQZAgii71cEAbGPTtXTuHQNERXKLLWTPDFbvjRxk9GZCVrZAdj0etCmCd90TkDBw88zq4kqbRRut6JQ9sjcZD'
account_id = 'act_4102226916661284'

# Fetch campaigns
url_campaigns = f'https://graph.facebook.com/v19.0/{account_id}/campaigns'
params_camp = {
    'access_token': token,
    'fields': 'id,name',
    'effective_status': '["ACTIVE", "PAUSED"]'
}
res_camp = requests.get(url_campaigns, params=params_camp).json()

campaign_id = None
for c in res_camp.get('data', []):
    if c['name'] == '[Camp-Orflie-Form-C01]':
        campaign_id = c['id']
        break

if not campaign_id:
    print("Campaign [Camp-Orflie-Form-C01] not found.")
else:
    # Fetch adsets
    url_adsets = f'https://graph.facebook.com/v19.0/{campaign_id}/adsets'
    params_adsets = {
        'access_token': token,
        'fields': 'id,name,targeting'
    }
    res_adsets = requests.get(url_adsets, params=params_adsets).json()
    with open('c:\\Users\\leo.cauchioli\\Desktop\\aios-core-main\\tmp\\orflie_adsets.json', 'w') as f:
        json.dump(res_adsets, f, indent=2)

    # Fetch insights for these adsets
    url_adsets_insights = f'https://graph.facebook.com/v19.0/{campaign_id}/insights'
    params_insights = {
        'access_token': token,
        'level': 'adset',
        'fields': 'adset_name,spend,impressions,clicks,cpc,cpm,actions,cost_per_action_type',
        'date_preset': 'last_7d'
    }
    res_insights = requests.get(url_adsets_insights, params=params_insights).json()
    with open('c:\\Users\\leo.cauchioli\\Desktop\\aios-core-main\\tmp\\orflie_adsets_insights.json', 'w') as f:
        json.dump(res_insights, f, indent=2)

# Search targets
def search_targets(q, type='adinterest'):
    url = f'https://graph.facebook.com/v19.0/search'
    res = requests.get(url, params={'type': type, 'q': q, 'access_token': token})
    return res.json().get('data', [])

queries = ['Planejamento estratégico', 'Totvs', 'SAP', 'Investimento', 'Pessoas que preferem bens de valor', 'Viajantes internacionais', 'Facebook Page Admins', 'Facebook payment users (90 days)', 'Hotmart', 'Dropshipping']

results = {}
for q in queries:
    results[q] = search_targets(q)

with open('c:\\Users\\leo.cauchioli\\Desktop\\aios-core-main\\tmp\\fb_search.json', 'w') as f:
    json.dump(results, f, indent=2)
