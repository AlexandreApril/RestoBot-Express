var OurObj = {
    1: {
        clientNum: 450 - 123 - 4567,
        parameters: {
            'number-integer': '7',
            time: '21:00:00',
            'geo-city': 'Québec City'
        }
    }
}

var globalObject = {
    originalRequest: {
        source: 'twilio',
        data: {
            MessagingServiceSid: 'MG30803df423f6ac98b5d4c1a759b90f3f',
            ApiVersion: '2010-04-01',
            SmsSid: 'SM73dec9d25fe968a882b7620e7346f3ff',
            SmsStatus: 'received',
            SmsMessageSid: 'SM73dec9d25fe968a882b7620e7346f3ff',
            NumSegments: '1',
            ToState: 'QC',
            From: '+15149804269',
            MessageSid: 'SM73dec9d25fe968a882b7620e7346f3ff',
            AccountSid: 'AC0ae1bbf711277ab3e08dd3c498b9c62c',
            ToCity: 'ST GENEVIA VE',
            FromCountry: 'CA',
            ToZip: '',
            FromCity: 'MONTREAL',
            To: '+15147002311',
            FromZip: '',
            ToCountry: 'CA',
            Body: 'Reservation for 7 in Quebec at 9 pm',
            NumMedia: '0',
            FromState: 'QC'
        }
    },
    id: 'b523c57d-c388-4fa0-be38-39e8a0a39c07',
    timestamp: '2018-02-20T17:41:19.414Z',
    lang: 'en',
    result: {
        source: 'agent',
        resolvedQuery: 'Reservation for 7 in Quebec at 9 pm',
        speech: '',
        action: '',
        actionIncomplete: false,
        parameters: {
            'number-integer': '7',
            time: '21:00:00',
            'geo-city': 'Québec City'
        },
        contexts: [[Object]],
        metadata: {
            intentId: 'f4dad90d-09a6-4120-86ca-9bc09672a0fa',
            webhookUsed: 'true',
            webhookForSlotFillingUsed: 'false',
            intentName: '-ReservationsByArea'
        },
        fulfillment: {
            speech: 'Reservation for 7 people in Québec City at 21:00:00 successful!',
            messages: [Object]
        },
        score: 1
    },
    status: {
        code: 200,
        errorType: 'success',
        webhookTimedOut: false
    },
    sessionId: '9dd1c046-662e-4d5d-a8fb-dd4551493645'
}
var otherObj = {
    originalRequest: {
        source: 'twilio',
        data: {
            MessagingServiceSid: 'MG30803df423f6ac98b5d4c1a759b90f3f',
            ApiVersion: '2010-04-01',
            SmsSid: 'SMe31806ca4ecc5a7c7cf82efda9cf64fe',
            SmsStatus: 'received',
            SmsMessageSid: 'SMe31806ca4ecc5a7c7cf82efda9cf64fe',
            NumSegments: '1',
            ToState: 'QC',
            From: '+15149804269',
            MessageSid: 'SMe31806ca4ecc5a7c7cf82efda9cf64fe',
            AccountSid: 'AC0ae1bbf711277ab3e08dd3c498b9c62c',
            ToCity: 'ST GENEVIA VE',
            FromCountry: 'CA',
            ToZip: '',
            FromCity: 'MONTREAL',
            To: '+15147002311',
            FromZip: '',
            ToCountry: 'CA',
            Body: 'Reservation for 6 in Montreal at 8 pm',
            NumMedia: '0',
            FromState: 'QC'
        }
    },
    id: '3772cd8b-0fb2-499c-b85b-4aad898de2da',
    timestamp: '2018-02-20T17:57:24.161Z',
    lang: 'en',
    result: {
        source: 'agent',
        resolvedQuery: 'Reservation for 6 in Montreal at 8 pm',
        speech: '',
        action: '',
        actionIncomplete: false,
        parameters: {
            'number-integer': '6',
            time: '20:00:00',
            'geo-city': 'Montréal'
        },
        contexts: [[Object]],
        metadata: {
            intentId: 'f4dad90d-09a6-4120-86ca-9bc09672a0fa',
            webhookUsed: 'true',
            webhookForSlotFillingUsed: 'false',
            intentName: '-ReservationsByArea'
        },
        fulfillment: {
            speech: 'Reservation for 6 people in Montréal at 20:00:00 successful!',
            messages: [Object]
        },
        score: 1
    },
    status: { code: 200, errorType: 'success', webhookTimedOut: false },
    sessionId: '9dd1c046-662e-4d5d-a8fb-dd4551493645'
}