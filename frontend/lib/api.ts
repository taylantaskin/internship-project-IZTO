
const API_BASE_URL = "http://localhost:8080/firmalar";

export interface FirmaDto{
    odaSicilNo: number;
    ticariSicilNo: number;
    unvani :string;
    tescilliAdresi: string;
    webAdresi: string;
    dijitalVarliklar:string;
    meslekGrubuAd: string;
    ilceAdi:string;
    naceKoduAd: string;

}

interface SorguParametreleri{
    unvani? : string; //unvani: string | undefined yani bu parametre opsiyonel demek "?"
    meslekGrubuAd?: string;
    ilceAd?:string;
    naceKodu?: string;
    sayfa?: number; //number js deki int ve float gibi sayısal değerleri kapsar
}

function parametreleriHazirla(params: SorguParametreleri): string{ // java aksine  tipler sağda, ":" dönüş parametresini belirtiyor
    const query = new URLSearchParams(); // urlsearchParams() js deki url parametrelerini hazırlamak için kullanılan bir sınıf
    if (params.unvani) { // if : false, 0, NaN, "", null, undefined gibi değerler falsy döner
    query.set("unvani", params.unvani); 
    }

    if (params.meslekGrubuAd){
        query.set("meslekGrubuAd",params.meslekGrubuAd);
    }
    
    if (params.ilceAd){
        query.set("ilceAd", params.ilceAd);
    }

    if (params.naceKodu){
        query.set("naceKodu", params.naceKodu);
    }

    if (params.sayfa ){
        query.set("sayfa", String(params.sayfa ?? 1));// sayfa parametresi varsa onu kullan, yoksa 1 kullan
        query.set("sayfaBoyutu", "50");
    }
    return query.toString(); //unvani=ABC&ilceAd=Konak
}

export async function getFirmalar(params: SorguParametreleri){
    const sorguMetni = parametreleriHazirla(params);
    const tamUrl = `${API_BASE_URL}?${sorguMetni}`;

    const response = await fetch(tamUrl);

    if (!response.ok){
        throw new Error ("firma verisi çekilemedi");
    }
    const data =await response.json();
    return data;
}

export async function getIlceler(){
    
    const response = await fetch(`${API_BASE_URL}/ilceler`);

    if (!response.ok){
        throw new Error ("ilçe verisi çekilemedi");
    }
    const data= await response.json();

    return data;

}

export async function getMeslekGruplari(){
    const response =await fetch (`${API_BASE_URL}/meslek-gruplari`);
    
    if(!response.ok){
        throw new Error ("meslek grubu verisi çekilemedi");
    }
    const data= await response.json();
    return data;
}


