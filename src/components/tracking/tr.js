let GTM = false//import.meta.env.PUBLIC_GTM_ID
if(GTM){
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', GTM);

    let sc = document.createElement('script')
    sc.async=true
    sc.src=`https://www.googletagmanager.com/gtag/js?id=${GTM}`
    // document.head.append(sc)

    window.addEventListener('load', () => document.head.append(sc) )    
}

let META = import.meta.env.PUBLIC_META_PIXEL_ID
if(META){
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', META);
    //fbq('track', 'PageView');
}

const cookie = document.cookie?.split("; ")
const fbp = cookie.find((row) => row.startsWith("_fbp="))?.split("=")[1]
const fbc = cookie.find((row) => row.startsWith("_fbc="))?.split("=")[1]

let loadData = {
    referrer: document.referrer,
    url: window.location.href,
    query: window.location.search,
    client_user_agent: navigator.userAgent,
    fbc: fbc,
    fbp: fbp,
}

export function sendEvent(eventName,eventDetails={},metaObj={}){

    //eventDetails = {name, email, phone, sheetName...}

    let event_ID = `prod${Date.now()}-${Math.ceil(Math.random()*1000000)}`

    //Send to Meta Pixel
    if(META){
        let stdEvents = ['ViewContent','PageView','CompleteRegistration','Lead','AddToCart','InitiateCheckout']
        if (stdEvents.includes(eventName)){
            fbq('track', eventName, metaObj, {eventID: event_ID}) 
        }else{
            fbq('trackCustom', eventName, metaObj, {eventID: event_ID})
        }
    }

    let mergedJsonData = {...loadData, eventName, event_ID, ...eventDetails}

    //Send to our edge function (Meta Conversions API, Google Sheets, Mailchimp, some custom POST webhook...)
    fetch('/sendevent', { 
        method: "POST",
        body: JSON.stringify(mergedJsonData)
    })
    
}

// sendEvent('PageView') //before Loading is complete
window.addEventListener('load', () => sendEvent('PageView') ) //right after page loading is complete

//Send the Load Event
//window.addEventListener('load', () => sendEvent('Load') )
