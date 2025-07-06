# Mikroservis Dönem Projesi

Bu proje, modern mikroservis mimarisi prensipleri kullanılarak geliştirilmiş, frontend ve backend katmanlarından oluşan bir dönem projesidir. Proje, birbirinden bağımsız çalışabilen, farklı sorumluluklara sahip servislerden ve bu servislere arayüz sağlayan bir frontend uygulamasından oluşmaktadır.

## 🏛️ Proje Mimarisi

Proje, temel olarak aşağıdaki servisleri ve katmanları içeren bir yapıya sahiptir. Servisler arası iletişim ve dış dünyaya açılan kapı bir API Gateway üzerinden yönetilmektedir.

* **Frontend Uygulaması:** Kullanıcıların sistemle etkileşime girdiği, React ile geliştirilmiş web arayüzü.
* **API Gateway:** Sisteme gelen tüm istekleri karşılayan ve ilgili mikroservise yönlendiren servistir.
* **Auth Service:** Kullanıcı kaydı, girişi ve yetkilendirme (JWT) işlemlerinden sorumludur.
* **User Service:** Kullanıcı profili bilgilerini yönetir.
* **Product Service:** Ürünlerin listelenmesi, eklenmesi gibi işlemleri gerçekleştirir.
* **Order Service:** Kullanıcıların sipariş işlemlerini yönetir.

## 🚀 Kullanılan Teknolojiler

* **Frontend:** React
* **Backend:** Java, Spring Boot
* **Veritabanı:** PostgreSQL
* **API Gateway:** Spring Cloud Gateway
* **Servis Keşfi:** Eureka Server
* **Konteynerleştirme:** Docker & Docker Compose
* **API Test:** Postman

## 🏁 Projeyi Başlatma

Projeyi yerel makinenizde çalıştırmak için iki yöntem bulunmaktadır. Hızlı ve otomatik kurulum için **Tek Tıkla Kurulum** yöntemini kullanmanız önerilir.

### ✅ Ön Gereksinimler

Başlamadan önce sisteminizde aşağıdaki araçların kurulu olduğundan emin olun:

* [**Docker**](https://www.docker.com/products/docker-desktop)
* [**Git**](https://git-scm.com/)
* [**Node.js & npm**](https://nodejs.org/) (Frontend için gerekli)
* [**Java Development Kit (JDK)**](https://www.oracle.com/java/technologies/downloads/) (Manuel kurulum için)
* [**Maven**](https://maven.apache.org/download.cgi) (Manuel kurulum için)

### 1. Tek Tıkla Kurulum (Önerilen Yöntem)

Projenin ana dizininde bulunan `setup.sh` betiği, tüm kurulum ve başlatma adımlarını sizin için otomatik olarak gerçekleştirir.

1.  **Projeyi Klonlayın:**
    ```sh
    git clone [https://github.com/Monarch34/microservice-term-project.git](https://github.com/Monarch34/microservice-term-project.git)
    cd microservice-term-project
    ```

2.  **Betiğe Çalıştırma İzni Verin:**
    (Eğer `setup.sh` dosyası yoksa, betik içeriğini bu isimle bir dosyaya kaydedin.)
    ```sh
    chmod +x setup.sh
    ```

3.  **Betiği Çalıştırın:**
    ```sh
    ./setup.sh
    ```
    Betiğin çalışması bittiğinde, backend servisleri ve frontend uygulaması arka planda çalışır durumda olacaktır.

### 2. Manuel Kurulum (Alternatif Yöntem)

Eğer adımları tek tek kendiniz yönetmek isterseniz bu yöntemi kullanabilirsiniz.

#### Backend'i Çalıştırma

1.  Proje ana dizinindeyken Docker Compose'u çalıştırın:
    ```sh
    docker-compose up --build -d
    ```
2.  Servislerin durumunu kontrol edin:
    ```sh
    docker-compose ps
    ```

#### Frontend'i Çalıştırma

1.  Yeni bir terminal açın ve frontend klasörüne gidin:
    ```sh
    cd frontend-app # Klasör adı farklıysa düzenleyin
    ```
2.  Gerekli paketleri yükleyin:
    ```sh
    npm install
    ```
3.  Uygulamayı başlatın:
    ```sh
    npm start
    ```

### 🛑 Projeyi Durdurma

Projeyi durdurma yöntemi, onu nasıl başlattığınıza bağlıdır.

* **Tek Tıkla Kurulum ile Başlatıldıysa:**
    * **Backend'i Durdurma:** Proje ana dizininde `docker-compose down` komutunu çalıştırın.
    * **Frontend'i Durdurma:** Kurulum betiği frontend'i arka planda başlattığı için, onu port numarasından bularak kapatmanız gerekir:
        ```sh
        kill $(lsof -t -i:3000)
        ```

* **Manuel Kurulum ile Başlatıldıysa:**
    * **Backend'i Durdurma:** Proje ana dizininde `docker-compose down` komutunu çalıştırın.
    * **Frontend'i Durdurma:** Frontend uygulamasını başlattığınız terminalde `Ctrl + C` tuşlarına basarak işlemi sonlandırın.

## 📡 API Endpointleri

Tüm mikroservislere, sisteme giriş noktası olan **API Gateway** üzerinden erişilir. Proje ayağa kalktıktan sonra isteklerinizi API Gateway adresine (`http://localhost:8765`) gönderebilirsiniz.

Aşağıda bazı örnek endpoint'ler listelenmiştir:

#### Auth Service (`/auth`)
* `POST /auth/register`: Yeni kullanıcı kaydı oluşturur.
* `POST /auth/login`: Kullanıcı girişi yaparak JWT token alır.

#### Product Service (`/product`)
* `GET /product`: Tüm ürünleri listeler.
* `POST /product`: Yeni bir ürün ekler. (Yetki gerektirir)

> **Not:** Tüm endpoint'lerin detaylı listesi, istek ve cevap formatları için her servisin kendi `Controller` dosyalarını veya (eğer yapılandırıldıysa) Swagger UI arayüzünü inceleyebilirsiniz.
