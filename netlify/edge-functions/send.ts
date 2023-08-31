import type { Config, Context } from "https://edge.netlify.com";
import { crypto } from "https://deno.land/std@0.200.0/crypto/crypto.ts";
import { toHashString } from "https://deno.land/std@0.200.0/crypto/to_hash_string.ts"
import { encode } from "https://deno.land/std/encoding/base64.ts"

const meta_access_token = Netlify.env.get('META_ACCESS_TOKEN')
const pixel_id =  Netlify.env.get('PUBLIC_META_PIXEL_ID')
const gsheets_endpoint = Netlify.env.get('SHEETS_ENDPOINT')
const mailchimp_key = Netlify.env.get('MAILCHIMP')

let current_timestamp = Math.floor(Date.now() / 1000);

async function send2Meta(request,context,pl){

  const ip = context.ip
  console.log("IP:",ip)
  let requestHeaders = Object.fromEntries(request.headers)

  console.log('iniciando...',pl.eventName, pl.event_ID, new Date())

  //Sanitize or Transform User Inputs
  let fn = pl.fn?.toLowerCase().trim()
  let email = pl.email?.toLowerCase().trim()
  let phone = pl.phone?.toLowerCase().trim()

  //sha256 hashed info
  if (fn){
    const hash_fn = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(fn))
    fn=toHashString(hash_fn)
  }

  if(email){
  const hash_email = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(email))
  email=toHashString(hash_email)}

  if(phone){
  const hash_phone = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(phone))
  phone=toHashString(hash_phone)}

  let reqBody = {
    "data": [
        {
            "event_name": pl.eventName,
            "event_id": pl.event_ID,
            "event_time": current_timestamp,
            "action_source": "website",
            "event_source_url": pl.url,
            "user_data": {
              "client_ip_address": ip,
              "client_user_agent": requestHeaders['user-agent'],
              "fbp": pl.fbp,
              "fbc": pl.fbc,
              "fn":fn,
              "em":email,
              "ph":phone
            }
        }
    ],
    "test_event_code": Netlify.env.get('META_TEST_CODE')
  }
  console.dir(reqBody, { depth: null })
  console.log(JSON.stringify(reqBody))

  let endpoint = `https://graph.facebook.com/v17.0/${pixel_id}/events?access_token=${meta_access_token}`

  console.log('fetching...')
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(reqBody)
  })
  const resJson = await res.json() //How to deal with response.json() @ https://developer.mozilla.org/en-US/docs/Web/API/Response/json#examples
  console.dir(resJson, { depth: null })

  return resJson
}

async function send2gsheets(request,context,pl){

  const ip = context.ip
  console.log("IP:",ip)
  //let requestHeaders = Object.fromEntries(request.headers)

  console.log('sending to sheet...',pl.eventName, pl.event_ID, new Date())

  let fData = new FormData()
  Object.entries(pl).map( ([key,value]) => fData.set(key,value) )
  if (pl.query){
      let query = new URLSearchParams(pl.query)
      query.forEach( (value,key) => fData.set(key,value) )
      // fData.set('utm_tracker', (query.get('fbclid') || ""))
  }
  fData.set('event', pl.eventName)
  fData.set('eventID',pl.event_ID)

  /* If you want to record the body sent to facebook on sheets...
  //Sanitize or Transform User Inputs
  let fn = pl.fn?.toLowerCase().trim()
  let email = pl.email?.toLowerCase().trim()
  let phone = pl.phone?.toLowerCase().trim()

  let reqBody = {
    "data": [
        {
            "event_name": pl.eventName,
            "event_id": pl.event_ID,
            "event_time": current_timestamp,
            "action_source": "website",
            "event_source_url": pl.url,
            "user_data": {
              "client_ip_address": ip,
              "client_user_agent": requestHeaders['user-agent'],
              "fbp": pl.fbp,
              "fbc": pl.fbc,
              "fn":fn,
              "em":email,
              "ph":phone
            }
        }
    ],
    "test_event_code": Netlify.env.get('META_TEST_CODE')
  }
  // console.log(JSON.stringify(reqBody))
  //fData.set('body2meta',JSON.stringify(reqBody))
  */

  console.log('fetching sheets endpoint...')
  const res = await fetch(gsheets_endpoint, {
    method: 'POST',
    body: fData
  })
  const resJson = await res.json() //How to deal with response.json() @ https://developer.mozilla.org/en-US/docs/Web/API/Response/json#examples
  console.dir(resJson, { depth: null })

  return resJson
}
async function send2mailchimp(request,context,pl){

  console.dir(pl)

  const ip = context.ip
  console.log("IP:",ip)
  //let requestHeaders = Object.fromEntries(request.headers)

  console.log('sending to mailchimp...',pl.eventName, pl.event_ID, new Date())

  /* If you want to record the body sent to facebook on sheets...
  //Sanitize or Transform User Inputs
  let fn = pl.fn?.toLowerCase().trim()
  let email = pl.email?.toLowerCase().trim()
  let phone = pl.phone?.toLowerCase().trim()
  */

  let dc = mailchimp_key.split('-')[1]
  let authHeader = 'Basic '+encode(`anystring:${mailchimp_key}`)
  console.log('searching list by name...')
  let endpoint_list = `https://${dc}.api.mailchimp.com/3.0/lists?fields=lists.id,lists.name`
  const resLists = await fetch(endpoint_list, {
      method: 'GET',
      headers: {'Authorization': authHeader}
  });
  const resListsJson = await resLists.json() //How to deal with response.json() @ https://developer.mozilla.org/en-US/docs/Web/API/Response/json#examples
  let list = resListsJson.lists.find(r => r.name == pl.mailchimpAudience)
  let listId = list.id

  let bodyJson = {
    "email_address":pl.email,
    "merge_fields":{"FNAME":pl.name,"PHONE":pl.tel},
    "tags":JSON.parse(pl.mailchimpTags),
    "status":"subscribed",
    "ip_opt":ip
  }
  console.log('body sent to mailchimp:')
  console.dir(bodyJson, { depth: null })

  console.log('adding member on list...')
  let endpoint=`https://${dc}.api.mailchimp.com/3.0/lists/${listId}/members`
  const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader
      },
      body: JSON.stringify(bodyJson)
  });
  const resJson = await res.json() //How to deal with response.json() @ https://developer.mozilla.org/en-US/docs/Web/API/Response/json#examples

  return resJson
}


//-------------------------------------------------------------

export default async (request: Request, context: Context) => {

  // console.log(`{\ncontext: ${JSON.stringify(context,null,2)}\n}`)

  if (request.method !== "POST") {
    return new Response(`Only POST requests allowed. ${request.method} request was made.`, { status: 410, statusText: "Not Allowed" })
  };

  let reqHeaders = Object.fromEntries(request.headers)
  let reqDomain = reqHeaders['origin']
  let myDomain =  context.site.url

  console.log('reqDomain',reqDomain)
  console.log('req referrer',request.referrer)
  console.log('myDomain context.site.url',context.site.url)

  //Check origin of request
  if (myDomain && (reqDomain !== myDomain)) {
    return new Response(`${reqDomain} not allowed`, { status: 410, statusText: "Not Allowed" })
  };

  //Check the body
  try {
    request.body
  } catch (error) {
    return new Response(`Body not sent. ${error}`, { status: 500, statusText: "Missing Body" })
  }
  
  //Showtime
  try {

    let payload = await request.json()
    // Validate required info
    // if (
    //   !payload.a ||
    //   !payload.b
    // ) { return new Response('Required information is missing.', { status: 422, statusText: "Required information is missing." })}

    const body = new ReadableStream({
      async start(controller) {
        const res1 = (meta_access_token && pixel_id)? await send2Meta(request,context,payload) : 'No meta access token or pixel'
        const res2 = gsheets_endpoint ? await send2gsheets(request,context,payload) : 'No google sheets endpoint'
        let res3 = ''
        if(mailchimp_key && payload.mailchimpAudience && payload.email){
          let r = await send2mailchimp(request,context,payload)
          delete r._links
          console.dir(r,{ depth: null })          
          res3= r.status=="subscribed" ? `mailchimp member ${r.email_address} added`: r
        }else{res3='No mailchimp key, audience or email'}
        
        let bodyJson = [res1, res2, res3]
        const bodyJsonString = JSON.stringify(bodyJson)
        controller.enqueue(new TextEncoder().encode(bodyJsonString));
        controller.close()
      }
    });
    return new Response(body, {headers:{"Content-Type": "text/plain"},status: 200, statusText: "Uhul!"});

  } catch (error) {
    console.log(error)
    return new Response(error, { status: 500, statusText: "Erro!" })
  }
}


export const config: Config = {
  path: "/sendevent",
};
