import requests, json
token = 'EAAUcCJJeKl4BQ16De7Sgi8zD8iovopgZCKoGQ2ZCRNF5aeY5zZBaSnvchfxBO5IWAFXt2ilZBZA7DpeSko25Xh6oJYKaST28IkXBJlZC4QpP9yDhUcomdpGzMhfzg3qhhAchujLk17DKbSo2EipjJaX16YEGk9KzlMYIZA9IrWZCOwQJUv364OqTib6hlngtHldoUa2WkHc9ePZBGC3gR1dQPXThMNVBWMSdSlglZBwC8jNGof5BGkeo1AZCtySAvNY4krgalVDvCxYWv5VU99hUdp48Wkqhxvh0SisJTowbyZAEQv7fCcmxJ0NSxHF5wSVAcNS7635P2UTBR0BE'
account_id = 'act_4102226916661284'

url = f'https://graph.facebook.com/v19.0/{account_id}/saved_audiences'

payload = {
    'name': '[ORFLIE] B2B Gestores + Sniper Exclusions (No Advantage+)',
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
with open('c:\\Users\\leo.cauchioli\\Desktop\\aios-core-main\\tmp\\create_audience_res2.json', 'w') as f:
    json.dump(res.json(), f, indent=2)
print(res.status_code)
