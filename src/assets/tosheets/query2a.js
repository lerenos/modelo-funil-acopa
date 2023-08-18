//Pegue todos os parâmetros da URL da visita atual
const newParams = new URLSearchParams(window.location.search) 

//Função para adicionar os novos parametros a um link
function addNewParams(el){
    if (el.href){ // testa se existe atributo href
        let url = new URL(el.href) //Pega o URL do Elemento
        let params = url.searchParams //Pega os parâmetros da URL do Elemento
    
        //Anexa os novos parâmetros ao link do elemento
        newParams.forEach((value, key) => {params.append(key,value)}) 
        
        //Faz com que utm_tracker do link seja fbclid
        params.set('utm_medium', newParams.get('fbclid') || params.get('utm_tracker'))
    
        url.search = params.toString()
        let hrefCta = url.toString() //Faz a url final
    
        el.href= hrefCta    
    } else {
        return //sai e não faz nada
    }

}

//Encontre todos os links na página
const links = document.querySelectorAll('a');

//Adicione os novos parametros
links.forEach( link => addNewParams(link) )


