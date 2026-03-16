import requests, json
token = 'EAAUcCJJeKl4BQ9OdHQSHDwJ7Ellfj6NeI3G14GCZACVllOWWYR96uD4BSvTZBAUZA8TAHPfAA73fQmnXCsVFB0yIOoENjyUIaEnpaZBoMpOVU1g62RxJsRIZB2AnJZBZC2PFYyZAz54hGJOlg7ZBx7DRAK27ZBN2ZB0L3B0ZCc2uVuYf0PIwIp7ZC8D9oe8HpB6ZCbMvYSPGdGePpCwi2S45hjUXbL5KMVe1M23bHpxAH10hwxuGFBJQvEK97c18ocx2ydffjCQZAgii71cEAbGPTtXTuHQNERXKLLWTPDFbvjRxk9GZCVrZAdj0etCmCd90TkDBw88zq4kqbRRut6JQ9sjcZD'
account_id = 'act_4102226916661284'
url = f'https://graph.facebook.com/v19.0/{account_id}/saved_audiences'

payload = {
    'name': '[ORFLIE CÉREBRO] B2B Gestores + Exclusão Sniper (Insta)',
    'targeting': json.dumps({
        'age_min': 30,
        'age_max': 55,
        'geo_locations': {'countries': ['BR']},
        'flexible_spec': [
            {
                'interests': [
                    {'id': '6003388161512', 'name': 'Planejamento estratégico'},
                    {'id': '6003388314512', 'name': 'Investimento (negócios e finanças)'},
                    {'id': '6004037932409', 'name': 'Gestão (negócios e finanças)'}
                ]
            },
            {
                'work_positions': [
                    {'id': '133337610036491', 'name': 'Founder, Director, CEO'},
                    {'id': '149598488387016', 'name': 'Owner and CEO'}
                ]
            }
        ],
        'exclusions': {
            'interests': [
                {'id': '6012293838236', 'name': 'Hotmart'},
                {'id': '6003109292833', 'name': 'Drop shipping (varejista)'}
            ]
        },
        'publisher_platforms': ['instagram', 'facebook']
    }),
    'access_token': token
}

res = requests.post(url, data=payload)
with open('c:\\Users\\leo.cauchioli\\Desktop\\aios-core-main\\tmp\\create_audience_res.json', 'w') as f:
    json.dump(res.json(), f, indent=2)
