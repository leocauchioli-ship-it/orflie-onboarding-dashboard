import requests, json

token = 'EAAUcCJJeKl4BQ16De7Sgi8zD8iovopgZCKoGQ2ZCRNF5aeY5zZBaSnvchfxBO5IWAFXt2ilZBZA7DpeSko25Xh6oJYKaST28IkXBJlZC4QpP9yDhUcomdpGzMhfzg3qhhAchujLk17DKbSo2EipjJaX16YEGk9KzlMYIZA9IrWZCOwQJUv364OqTib6hlngtHldoUa2WkHc9ePZBGC3gR1dQPXThMNVBWMSdSlglZBwC8jNGof5BGkeo1AZCtySAvNY4krgalVDvCxYWv5VU99hUdp48Wkqhxvh0SisJTowbyZAEQv7fCcmxJ0NSxHF5wSVAcNS7635P2UTBR0BE'
account_id = 'act_4102226916661284'

# Fetch saved audiences
url = f'https://graph.facebook.com/v19.0/{account_id}/saved_audiences'
params = {'access_token': token, 'fields': 'id,name', 'limit': 10}
res = requests.get(url, params=params).json()

with open('c:\\Users\\leo.cauchioli\\Desktop\\aios-core-main\\tmp\\saved_audiences_check.json', 'w') as f:
    json.dump(res, f, indent=2)

# Get Page ID from existing ads
url_ads = f'https://graph.facebook.com/v19.0/{account_id}/ads'
params_ads = {'access_token': token, 'fields': 'id,name,adcreatives{object_story_spec}', 'limit': 5}
res_ads = requests.get(url_ads, params=params_ads).json()

with open('c:\\Users\\leo.cauchioli\\Desktop\\aios-core-main\\tmp\\ads_check.json', 'w') as f:
    json.dump(res_ads, f, indent=2)
