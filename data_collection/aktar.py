import pandas as pd
from sqlalchemy import create_engine

# 1. Excel dosyasını oku
dosya_yolu = "izto_tum_firmalar_temiz.xlsx"
print("1. Excel dosyası okunuyor, lütfen bekleyin...")
df = pd.read_excel(dosya_yolu, dtype=str)

# MySQL'de boşluk ve Türkçe karakterler hata vermesin diye sütun isimlerini temizliyoruz
df.columns = ['oda_sicil_no', 'ticari_sicil_no', 'meslek_grubu', 'nace_kodu', 'unvani', 'ilce', 'tescilli_adresi', 'web_adresi']

# 2. MySQL Bağlantı Bilgileri (Belirlediğimiz şifre ve veritabanı)
kullanici = "root"
sifre = "change35" 
host = "127.0.0.1"
port = "3306"
veritaban_adi = "staj_db" 

# 3. MySQL'e Bağlan ve Aktar
try:
    print("2. Veritabanına bağlanılıyor...")
    motor = create_engine(f'mysql+pymysql://{kullanici}:{sifre}@{host}:{port}/{veritaban_adi}')
    
    tablo_adi = "izto_firmalar"
    
    # Veriyi MySQL'e yaz
    df.to_sql(name=tablo_adi, con=motor, if_exists='replace', index=False)
    print("3. Harika! Excel'deki tüm firmalar başarıyla MySQL'e aktarıldı. ")

except Exception as e:
    print(f"Bir hata oluştu: {e}")