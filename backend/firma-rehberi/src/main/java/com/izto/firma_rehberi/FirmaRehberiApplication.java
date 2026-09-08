package com.izto.firma_rehberi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import com.izto.firma_rehberi.repository.FirmaRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
@SpringBootApplication
public class FirmaRehberiApplication {

	public static void main(String[] args) {
		SpringApplication.run(FirmaRehberiApplication.class, args);
	}

	@Bean
	public CommandLineRunner commandLineRunner(FirmaRepository firmaRepository) {
		return args -> {
			long count = firmaRepository.count();
            System.out.println("=========================================");
            System.out.println("VERİTABANI BAĞLANTISI BAŞARILI!");
            System.out.println("Sistemde Kayıtlı Toplam Firma Sayısı: " + count);
            System.out.println("=========================================");
		};
	}
}
