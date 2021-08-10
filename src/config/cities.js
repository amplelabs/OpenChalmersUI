/* eslint-disable */

const cities = {
  Toronto: {
    aliases: ['Toronto'],
    intersection: 'Yonge and Dundas or King Station, Toronto.',
    greeting: `Hello my name is <b>Chalmers</b>, and I am what is known as a "chat-bot" ## I was designed by Ample Labs to help you find <b>free services</b> in the City of Toronto such as the following:`,
    lat: 43.6532,
    long: -79.3832,
    radius: 21,
    enabled: true,
    altShelter: true,
    altShelterMsg: `To reserve an overnight shelter bed, contact Central Intake at <a href='tel:416-338-4766'>416-338-4766</a>, which is available 24/7. ## <div id="covid-message"><img src="https://chalmers-assets.s3.amazonaws.com/alert-triangle.svg" width="18px" height="19px" id="covid-banner">COVID-19 Alert</div><br><span class='covid-alert'>Due to COVID-19, 129 Peter Street assessment centre is now closed.<br><br>📞 The only way to reserve a bed is by calling <a href='tel:416-338-4766' style='color:#D32028;'>416-338-4766</a>.</span>`
  },
  Hamilton: {
    aliases: ['Hamilton'],
    intersection: 'Bay Street and Main Street, Hamilton.',
    greeting: `Hello my name is <b>Chalmers</b>, and I am what is known as a "chat-bot" ## I was designed by Ample Labs to help you find <b>free services</b> in the City of Hamilton such as the following:`,
    lat: 43.2557,
    long: -79.8711,
    radius: 27.22,
    enabled: true,
    altShelter: false
  },
  Halton: {
    aliases: ['Halton', 'Halton Hills', 'Burlington', 'Oakville', 'Milton', 'Georgetown', 'Acton', 'Scotch Block'],
    intersection: 'Bronte and Lakeshore, Oakville.',
    greeting: `Hello my name is <b>Chalmers</b>, and I am what is known as a "chat-bot" ## I was designed by Ample Labs to help you find <b>free services</b> in the Region of Halton such as the following:`,
    lat: 43.5325,
    long: -79.8745,
    radius: 22,
    enabled: true,
    altShelter: true,
    altShelterMsg: `<b>Halton's emergency shelters help individuals and families regain stable housing. If you are in need of emergency shelter please call <a href='tel:311'>311</a>.</b></br></br><i>If you would like to speak with shelter or support staff directly:</i></br></br>Lighthouse Shelter (single adults and couples with no children): <a href="tel:905-339-2918">905-339-2918</a></br></br>If you are a family with children and in need of emergency shelter, intake staff through Wesley Urban Ministries will assist you in finding temporary housing:  <a href="tel:905-825-6000">905-825-6000</a> (311).</br></br>If you are a family or woman experiencing domestic violence, please call Halton Women’s Place:  Burlington Shelter <a href="tel:905-332-1593">905-332-1593</a>; Milton Shelter <a href="tel:905-878-8970">905-878-8970</a> ## <b>Halton Region also provides homelessness prevention services to assist you in obtaining or regaining housing.</b></br></br>For youth (16-24) outreach assistance please call Bridging the Gap:  <a href="tel:877-425-8661">877-425-8661</a></br></br>Need help with your housing or require outreach services?  Call Halton Housing Help: <a href="tel:877-813-3363">+1 877-813-3363</a>`
  },
  'Halton-Burlington': {
    aliases: ['Halton', 'Halton Hills', 'Burlington', 'Oakville', 'Milton', 'Georgetown', 'Acton', 'Scotch Block'],
    intersection: 'Bronte and Lakeshore, Oakville.',
    greeting: `Hello my name is <b>Chalmers</b>, and I am what is known as a "chat-bot" ## I was designed by Ample Labs to help you find <b>free services</b> in the Region of Halton such as the following:`,
    lat: 43.32444,
    long: -79.79631,
    radius: 10,
    enabled: true,
    altShelter: true,
    altShelterMsg: `<b>Halton's emergency shelters help individuals and families regain stable housing. If you are in need of emergency shelter please call <a href='tel:311'>311</a>.</b></br></br><i>If you would like to speak with shelter or support staff directly:</i></br></br>Lighthouse Shelter (single adults and couples with no children): <a href="tel:905-339-2918">905-339-2918</a></br></br>If you are a family with children and in need of emergency shelter, intake staff through Wesley Urban Ministries will assist you in finding temporary housing:  <a href="tel:905-825-6000">905-825-6000</a> (311).</br></br>If you are a family or woman experiencing domestic violence, please call Halton Women’s Place:  Burlington Shelter <a href="tel:905-332-1593">905-332-1593</a>; Milton Shelter <a href="tel:905-878-8970">905-878-8970</a> ## <b>Halton Region also provides homelessness prevention services to assist you in obtaining or regaining housing.</b></br></br>For youth (16-24) outreach assistance please call Bridging the Gap:  <a href="tel:877-425-8661">877-425-8661</a></br></br>Need help with your housing or require outreach services?  Call Halton Housing Help: <a href="tel:877-813-3363">+1 877-813-3363</a>`
  },
  Peel: {
    aliases: ['Mississauga', 'Brampton', 'Caledon'],
    intersection: 'Hurontario and Dixie, Mississauga.',
    greeting: `Hello my name is <b>Chalmers</b>, and I am what is known as a "chat-bot" ## I was designed by Ample Labs to help you find free services in the Region of Peel such as the following:`,
    lat: 43.647508,
    long: -79.684368,
    radius: 15,
    enabled: true,
    altShelter: false
  },
  "York": {
    aliases: ['Vaughan', 'Richmond Hill', 'Markham', 'Newmarket', 'Whitchurch-Stouffville', 'Aurora', 'East Gwillmbury', 'King City', 'Gormley', 'Balantree', 'Nobleton'],
    intersection: 'Yonge and Elgin Mills, Richmond Hill.',
    greeting: `Hello my name is <b>Chalmers</b>, and I am what is known as a "chat-bot" ## I was designed by Ample Labs to help you find free services in the York Region such as the following:`,
    lat: 43.96675,
    long: -79.47873,
    radius: 39,
    enabled: true,
    altShelter: false
  },
  "York-Vaughan": {
    aliases: ['Vaughan', 'Richmond Hill', 'Markham', 'Newmarket', 'Whitchurch-Stouffville', 'Aurora', 'East Gwillmbury', 'King City', 'Gormley', 'Balantree', 'Nobleton'],
    intersection: 'Yonge and Elgin Mills, Richmond Hill.',
    greeting: `Hello my name is <b>Chalmers</b>, and I am what is known as a "chat-bot" ## I was designed by Ample Labs to help you find free services in the York Region such as the following:`,
    lat: 43.9251054,
    long: -79.7631531,
    radius: 14,
    enabled: true,
    altShelter: false
  },
  "Durham": {
    aliases: ['Pickering', 'Ajax', 'Whitby', 'Oshawa', 'Courtice', 'Uxbridge', 'Bowmanville', 'Port Perry', 'Clarington'],
    intersection: 'King Street and Simcoe Street, Oshawa.',
    greeting: `Hello my name is <b>Chalmers</b>, and I am what is known as a "chat-bot" ## I was designed by Ample Labs to help you find free services in the Durham Region such as the following:`,
    lat: 44.00949,
    long: -79.03466,
    radius: 36,
    enabled: true,
    altShelter: false
  },
  "Durham-Pickering": {
    aliases: ['Pickering', 'Ajax', 'Whitby', 'Oshawa', 'Courtice', 'Uxbridge', 'Bowmanville', 'Port Perry', 'Clarington'],
    intersection: 'King Street and Simcoe Street, Oshawa.',
    greeting: `Hello my name is <b>Chalmers</b>, and I am what is known as a "chat-bot" ## I was designed by Ample Labs to help you find free services in the Durham Region such as the following:`,
    lat: 43.83833,
    long: -79.08733,
    radius: 8,
    enabled: true,
    altShelter: false
  },
};

export default cities;
