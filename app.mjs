import fetch from "node-fetch"
import * as cheerio from "cheerio"


async function decodeHtml(response, charset){
    const buffer = await response.arrayBuffer()
    const decoder = new TextDecoder(charset)
    const text = decoder.decode(buffer)
    return text
}

async function checkStock(url, selector, stockMessage, charset){
    try{
        let response = await fetch(url) 
        if (!response.ok){
            throw `${response.status}: ${response.statusText}`
        }
        const html = await decodeHtml(response, charset)
        const $ = cheerio.load(html)
    
        let goodsInformation = $(selector)
        return goodsInformation.text().match(stockMessage) == null
    }catch(err){
        console.error(`Could not fetch: ${err}`)
    }
}

async function fetchFromZozo(){
    const zozoUrl = "https://zozo.jp/shop/gostardefuga/goods/69579979/?did=114350784&rid=1004"
    const zozoOutOfStock = "在庫なし"
    const charset = "Shift_JIS"
    const zozoInStock = await checkStock(zozoUrl, "#goodsRight >.p-goods-information__stock", zozoOutOfStock, charset)
    console.log(zozoInStock ? "In stock" : "Out of stock")
}

async function fetchFromBuyeeYahoo(){
    const buyeeUrl = "https://buyee.jp/item/yahoo/shopping/zozo_69579979/category/?conversionType=service_page_search"
    const outOfStock = "You are unable to buy this item because the item is sold out."
    const charset = "UTF-8"
    const yahooInStock = await checkStock(buyeeUrl, "#shopping_attr_container .messagebox .inbox", outOfStock, charset)
    console.log(yahooInStock ? "In stock" : "Out of stock")
}

async function mockPost(){
    const url = "https://buyee.jp/item/yahoo/shopping/zozo_69579979"//'https://buyee.jp/item/yahoo/shopping/zozo_59852532'
    const body = {
        "shopping[itemOption_0]": "0",
        "shopping[itemOption_1]": "0",
        "shopping[quantity]": "1",
        "addCartItemCode":"",
        "shopping[_csrf_token]": "05b594ee5fb8c9312244b18ea519608e",
    }
    const bodyEncoded = new URLSearchParams(Object.entries(body)).toString();
    console.log(bodyEncoded)
    const response = await fetch(url, {
        method: 'post',
                          //"shopping%5BitemOption_0%5D=1&shopping%5BitemOption_1%5D=1&shopping%5Bquantity%5D=1&addCartItemCode=&shopping%5B_csrf_token%5D=05b594ee5fb8c9312244b18ea519608e
        body: bodyEncoded,//"shopping%5BitemOption_0%5D=1&shopping%5BitemOption_1%5D=0&shopping%5Bquantity%5D=1&addCartItemCode=&shopping%5B_csrf_token%5D=05b594ee5fb8c9312244b18ea519608e",//JSON.stringify(body),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            "Cookie": "otherbuyee=hpv3bjb9hmhavbmljhjun9l5a6; version=addc3872d2261982bba5bf088cca515c45206311; mdlCp=1; convoId=eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJZV1J0YVc1amVXSmxjZz09IiwiY3JlYXRlZEF0IjoxNjY5Nzc5NTY5MDc4LCJib3RJZCI6ImJ1eWVlX2VuX2RldiIsInVzZXJJZCI6IllXUnRhVzVqZVdKbGNnPT0iLCJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjY5Nzc5NTY5fQ.VHj6Ogu9PdBzmy9eNi9izjVdVaaqlBWtkyVzI6KVSU8; searchhistory=%5B%22REFLEM+%5Cu00d7+%5Cu30af%5Cu30ed%5Cu30df%5Cu3000%5Cu30d5%5Cu30a1%5Cu30fc%5Cu30d1%5Cu30fc%5Cu30ab%5Cu30fc%22%2C%22Kuromi+fur+parka%22%2C%22%5Cu30b7%5Cu30ca%5Cu30e2%5Cu30ed%5Cu30fc%5Cu30eb%22%2C%22%5Cu30b7%5Cu30ca%5Cu30e2%5Cu30ed%5Cu30fc%5Cu30eb%5Cu00d7LAND+BEAR%22%2C%22CINNAMOROLL+CLOUD+BOA+%5Cu30b8%5Cu30e3%5Cu30b1%5Cu30c3%5Cu30c8+%22%2C%22%5Cu2606+%5Cu4e88%5Cu7d04%5Cu5546%5Cu54c1+%5Cu2606+CINNAMOROLL+CLOUD+BOA%22%5D; is_cart_remind=1",
        }
    })
    console.log(response.ok ? "POST add to cart works." : "POST does not work")
}
mockPost()

