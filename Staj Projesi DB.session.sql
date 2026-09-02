

SHOW TABLES;

DESCRIBE izto_firmalar;

DESCRIBE firmalar;

SELECT * FROM firmalar LIMIT 5;

SELECT
    COUNT(*) AS Toplam_Kayit,
    SUM(CASE WHEN ilce_id IS NULL THEN 1 ELSE 0 END) AS Bos_Ilce_Sayisi,
    SUM(CASE WHEN meslek_id IS NULL THEN 1 ELSE 0 END) AS Bos_Meslek_Sayisi
FROM firmalar;

SHOW CREATE TABLE firmalar;


SELECT 
    COLUMN_NAME,
    CONSTRAINT_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM İNFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = "staj_db"
    AND TABLE_NAME = "firmalar"
    AND REFERENCED_TABLE_NAME iS NOT NULL;

ALTER TABLE firmalar
RENAME COLUMN `Ticari Sicil No` TO ticari_sicil_no,
RENAME COLUMN `Ünvanı` TO unvani,
RENAME COLUMN `Tescilli Adresi` TO tescilli_adresi,
RENAME COLUMN `Web Adresi` TO web_adresi;

ALTER TABLE firmalar
RENAME COLUMN `Oda Sicil No` TO oda_sicil_no;

ALTER TABLE firmalar
RENAME COLUMN `Nace Kodu` TO nace_kodu;

CREATE TABLE nace_codları (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nace_kodu VARCHAR(500) UNIQUE NOT NULL
);

ALTER TABLE nace_codları RENAME TO nace_kodları;

INSERT INTO nace_kodları (nace_kodu)
SELECT DISTINCT nace_kodu FROM FIRMALAR WHERE nace_kodu IS NOT NULL;

DESCRIBE nace_kodları;

ALTER TABLE firmalar ADD COLUMN nace_id INT ;

SELECT MAX(CHAR_LENGTH('Nace Kodu'))
    AS max_length
    FROM firmalar 
;

SELECT nace_kodu FROM izto_firmalar LIMIT 10;

SELECT nace_kodu FROM firmalar LIMIT 10;

SELECT MAX(CHAR_LENGTH(`nace_kodu`)) AS max_length
FROM izto_firmalar;

UPDATE firmalar f JOIN nace_kodları n ON f.nace_kodu = n.nace_kodu 
SET f.nace_id = n.id;

-- yukardakinin aynısı

UPDATE firmalar AS f JOIN nace_kodları AS n ON F.nace_kodu = n.nace_kodu SET f.nace_id= n.id; #firmalar → f
nace_kodlari → n

-- yada uzun hali
UPDATE firmalar
JOIN nace_kodları
ON firmalar.nace_kodu = nace_kodları.nace_kodu
SET firmalar.nace_id = nace_kodları.id;

SELECT id FROM nace_kodları LIMIT 10;
SELECT id,nace_kodu FROM nace_kodları LIMIT 10;

-- ANA TABLO 
SELECT nace_id, ticari_sicil_no FROM firmalar LIMIT 10;
ALTER TABLE FİRMALAR DROP COLUMN nace_kodu;

SELECT COUNT (*) FROM firmalar WHERE nace_id IS NULL;

SELECT ticari_sicil_no, nace_id, ilce_id, meslek_id FROM firmalar LIMIT 10;

-- nace_id ile nace_name ayırma

ALTER TABLE nace_kodları ADD COLUMN nace_adi VARCHAR(500);
UPDATE nace_kodları 
SET nace_adi =
    TRIM(
        SUBSTRING(-- SUBSTRING(metin, başlangıç, uzunluk)
            nace_kodu,
            LOCATE(' - ', nace_kodu) +3 -- SUBSTRING(nace_kodu, 12)
        )
    )    -- 9+ 3=12 " - " ifadesi toplam 3 karakter:
WHERE LOCATE (' - ', nace_kodu) >0; -- İçinde " - " bulunan kayıtlarla işlem yap.

UPDATE nace_kodları 
SET nace_kodu=
    TRIM(
        SUBSTRING_INDEX(
            nace_kodu,
            ' - ',
            1  -- negatif değerlerde sağdan sayar.
        ) -- SUBSTRING_INDEX(metin, ayirici, adet)
    )
where locate (' - ', nace_kodu) >0; 

DESCRIBE nace_kodları;
SHOW COLUMNS FROM nace_kodları;

SELECT * FROM nace_kodları LIMIT 10;

DESCRIBE ilceler;
SHOW COLUMNS FROM ilceler;
SELECT COUNT(ilce_id) FROM ilceler;



ALTER TABLE ilceler MODIFY COLUMN ilce_id TINYINT UNSIGNED NOT NULL ;
ALTER TABLE ilceler ADD PRIMARY KEY (ilce_id);

SELECT COUNT (meslek_id) FROM meslek_gruplari;
SELECT COUNT (id) FROM nace_kodları;

ALTER TABLE meslek_gruplari MODIFY COLUMN meslek_id TINYINT UNSIGNED NOT NULL;
ALTER TABLE nace_kodları MODIFY COLUMN id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT; 

ALTER TABLE firmalar 
    MODIFY COLUMN ilce_id TINYINT UNSIGNED,
    MODIFY COLUMN meslek_id TINYINT UNSIGNED,
    MODIFY COLUMN nace_id SMALLINT UNSIGNED;

ALTER TABLE firmalar
    MODIFY COLUMN oda_sicil_no VARCHAR(50),
    MODIFY COLUMN ticari_sicil_no VARCHAR(50),
    MODIFY COLUMN unvani VARCHAR(500),
    MODIFY COLUMN tescilli_adresi VARCHAR(500),
    MODIFY COLUMN web_adresi VARCHAR(255),
    MODIFY COLUMN dijital_varlıklar VARCHAR(255);

ALTER TABLE ilceler MODIFY COLUMN ilce_adi VARCHAR(100);
ALTER TABLE meslek_gruplari MODIFY COLUMN meslek_adi VARCHAR(255);
ALTER TABLE nace_kodları MODIFY COLUMN nace_kodu VARCHAR(20);
-- bunu çalıştırma
SELECT * FROM INFORMATION_SCHEMA.COLUMNS;

SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = "staj_db";

SELECT 
    TABLE_NAME AS "TABLO",
    COLUMN_NAME AS "SÜTUN",
    COLUMN_TYPE AS "VERİ TİPİ",
    COLUMN_KEY AS "ANAHTAR"
FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA ="staj_db"
AND TABLE_NAME IN (
    "firmalar",
    "ilceler",
    "meslek_gruplari",
    "nace_kodlari"
)
ORDER BY TABLE_NAME,ORDINAL_POSITION;

RENAME TABLE nace_kodları TO nace_kodlari;


ALTER TABLE ilceler MODIFY COLUMN ilce_id 

-- 2. TEXT olan sütunları kurumsal standart olan VARCHAR'a çevir
ALTER TABLE ilceler 
MODIFY COLUMN ilce_adi VARCHAR(100);

ALTER TABLE meslek_gruplari 
MODIFY COLUMN meslek_adi VARCHAR(255);

ALTER TABLE nace_kodlari 
MODIFY COLUMN nace_kodu VARCHAR(20);

-- 3. Meslek grupları tablosundaki eksik Primary Key'i (PRI) ata
ALTER TABLE meslek_gruplari 
ADD PRIMARY KEY (meslek_id);

ALTER TABLE firmalar MODIFY COLUMN oda_sicil_no VARCHAR(50) NOT NULL, ADD PRIMARY KEY (oda_sicil_no); 

ALTER TABLE firmalar
ADD CONSTRAINT fk_firmalar_ilce
    FOREIGN KEY (ilce_id) 
        REFERENCES ilceler(ilce_id),
ADD CONSTRAINT fk_firmalar_meslek
    FOREIGN KEY (meslek_id)
        REFERENCES  meslek_gruplari(meslek_id),
ADD CONSTRAINT fk_firmalar_nace
    FOREIGN KEY (nace_id)
        REFERENCES nace_kodlari(id);


 --ALTER TABLE firmalar FOREIGN KEY (ilce_id) REFERENCES ilceler(ilce_id); böylede yazılıyor 
        

SELECT DISTINCT f.ilce_id
FROM firmalar f
LEFT JOIN ilceler i
ON f.ilce_id = i.ilce_id
WHERE i.ilce_id IS NULL;

SELECT COUNT(*)
FROM firmalar
WHERE ilce_id IS NULL;

ALTER TABLE firmalar
MODIFY COLUMN ilce_id TINYINT UNSIGNED ;

-- İlçe tablosundaki referans ID'yi garantile
ALTER TABLE ilceler 
MODIFY COLUMN ilce_id TINYINT UNSIGNED NOT NULL;

-- Firmalar tablosundaki referans ID'yi birebir aynı yap
ALTER TABLE firmalar 
MODIFY COLUMN ilce_id TINYINT UNSIGNED;

ALTER TABLE firmalar
ADD CONSTRAINT fk_firmalar_ilce 
    FOREIGN KEY (ilce_id) REFERENCES ilceler(ilce_id);

--firmalar tablosunda bulunan ama ilceler tablosunda bulunmayan ilce_id değerleri
SELECT DISTINCT ilce_id FROM firmalar
WHERE ilce_id IS NOT NULL AND ilce_id NOT IN (
    SELECT ilce_id FROM ilceler
)


-- ilceler tablosunda var ama hiçbir firma tarafından kullanılmayan ilçeler.
SELECT DISTINCT ilce_id
FROM ilceler
WHERE ilce_id NOT IN (
    SELECT ilce_id
    FROM firmalar
    WHERE ilce_id IS NOT NULL
);

--Pandas bazen tabloyu oluştururken MySQL motorunu "MyISAM" olarak ayarlayabilir.
ALTER TABLE ilceler ENGINE = InnoDB;
ALTER TABLE firmalar ENGINE =InnoDB;

ALTER TABLE ilceler MODIFY COLUMN ilce_id TINYINT UNSIGNED NOT NULL;
ALTER TABLE firmalar MODIFY COLUMN ilce_id TINYINT UNSIGNED;

ALTER TABLE firmalar
ADD CONSTRAINT fk_firmalar_ilce 
    FOREIGN KEY (ilce_id) REFERENCES ilceler(ilce_id);


SELECT f.ilce_id, COUNT(*) as firma_sayisi FROM firmalar f
LEFT JOIN ilceler i 
ON f.ilce_id = i.ilce_id --firma	f.ilce_id	i.ilce_id	ilce_adi
                                                --  ABC   	1  	      1	           Konak
                                                --firma	f.ilce_id	i.ilce_id	ilce_adi
                                                --GHI	    5	         NULL       NULL
WHERE i.ilce_id IS NULL --ilceler tablosunda eşleşen bir ilçe bulunamayan kayıtları getir.firmalar tablosunda bulunan ilce_id için ilceler tablosunda eşleşme bulunamamış.
AND f.ilce_id IS NOT NULL
GROUP BY f.ilce_id;

--ilce_id değeri 0 olan kayıtları görmek için:
SELECT * FROM firmalar WHERE ilce_id =0;

SELECT * FROM ilceler ORDER BY ilce_adi;

UPDATE firmalar SET ilce_id= NULL
WHERE ilce_id =0;

