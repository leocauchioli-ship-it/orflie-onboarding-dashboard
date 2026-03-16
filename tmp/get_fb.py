import requests, json
token = 'EAAUcCJJeKl4BQ9OdHQSHDwJ7Ellfj6NeI3G14GCZACVllOWWYR96uD4BSvTZBAUZA8TAHPfAA73fQmnXCsVFB0yIOoENjyUIaEnpaZBoMpOVU1g62RxJsRIZB2AnJZBZC2PFYyZAz54hGJOlg7ZBx7DRAK27ZBN2ZB0L3B0ZCc2uVuYf0PIwIp7ZC8D9oe8HpB6ZCbMvYSPGdGePpCwi2S45hjUXbL5KMVe1M23bHpxAH10hwxuGFBJQvEK97c18ocx2ydffjCQZAgii71cEAbGPTtXTuHQNERXKLLWTPDFbvjRxk9GZCVrZAdj0etCmCd90TkDBw88zq4kqbRRut6JQ9sjcZD'
account_id = 'act_4102226916661284'
url = f'https://graph.facebook.com/v19.0/{account_id}/insights'

res = {}
for preset in ['yesterday', 'today', 'last_3d']:
    params = {
        'access_token': token,
        'level': 'campaign',
        'fields': 'campaign_name,spend,impressions,clicks,cpc,cpm,actions,cost_per_action_type',
        'date_preset': preset
    }
    r = requests.get(url, params=params)
    res[preset] = r.json()

def clean_actions(actions_list):
    if not actions_list: return {}
    return {a['action_type']: a['value'] for a in actions_list}

summary = {}
for preset in res:
    summary[preset] = []
    if 'data' in res[preset]:
        for camp in res[preset]['data']:
            c = {
                'Campaign': camp.get('campaign_name'),
                'Spend': camp.get('spend'),
                'Impr': camp.get('impressions'),
                'Clicks': camp.get('clicks'),
                'CPC': camp.get('cpc'),
                'Leads': clean_actions(camp.get('actions')).get('lead', clean_actions(camp.get('actions')).get('onsite_conversion.lead', clean_actions(camp.get('actions')).get('offsite_conversion.lead', '0'))),
                'Cost_per_Lead': clean_actions(camp.get('cost_per_action_type')).get('lead', clean_actions(camp.get('cost_per_action_type')).get('onsite_conversion.lead', clean_actions(camp.get('cost_per_action_type')).get('offsite_conversion.lead', 'N/A')))
            }
            summary[preset].append(c)

with open("c:\\Users\\leo.cauchioli\\Desktop\\aios-core-main\\tmp\\fb_insights_summary.json", "w") as f:
    json.dump(summary, f, indent=2)
