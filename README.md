# Mikroservis Dönem Projesi

Bu proje, modern mikroservis mimarisi prensipleri kullanılarak geliştirilmiş, frontend ve backend katmanlarından oluşan bir dönem projesidir. Proje, birbirinden bağımsız çalışabilen, farklı sorumluluklara sahip servislerden ve bu servislere arayüz sağlayan bir frontend uygulamasından oluşmaktadır.

## 🏛️ Proje Mimarisi

Proje, temel olarak aşağıdaki servisleri ve katmanları içeren bir yapıya sahiptir. Servisler arası iletişim ve dış dünyaya açılan kapı bir API Gateway üzerinden yönetilmektedir.

* **Frontend Uygulaması:** Kullanıcıların sistemle etkileşime girdiği, React/Angular/Vue gibi modern bir framework ile geliştirilmiş web arayüzü.
* **API Gateway:** Sisteme gelen tüm istekleri karşılayan ve ilgili mikroservise yönlendiren servistir. Güvenlik, loglama ve yönlendirme gibi merkezi görevleri üstlenir.
* **Auth Service (Kimlik Doğrulama Servisi):** Kullanıcı kaydı, girişi ve yetkilendirme (JWT token üretimi vb.) işlemlerinden sorumludur.
* **User Service (Kullanıcı Servisi):** Kullanıcı profili bilgilerini (oluşturma, güncelleme, silme) yönetir.
* **Product Service (Ürün Servisi):** Ürünlerin listelenmesi, eklenmesi, güncellenmesi ve silinmesi gibi işlemleri gerçekleştirir.
* **Order Service (Sipariş Servisi):** Kullanıcıların sipariş oluşturma ve geçmiş siparişlerini görüntüleme işlemlerini yönetir.
* **Database:** Her servisin kendi veritabanı olabileceği gibi, bu projede merkezi bir veritabanı da kullanılmış olabilir.

## 🚀 Kullanılan Teknolojiler

Projenin geliştirilmesinde aşağıdaki teknolojiler ve araçlar kullanılmıştır:

* **Frontend:** React (veya projenizde kullanılan diğer teknoloji: Angular, Vue.js)
* **Backend:** Java, Spring Boot
* **Veritabanı:** PostgreSQL (veya projenizde kullanılan diğer veritabanı)
* **API Gateway:** Spring Cloud Gateway (veya projenizde kullanılan diğer gateway)
* **Servis Kaydı ve Keşfi (Service Discovery):** Eureka Server
* **Konteynerleştirme:** Docker & Docker Compose
* **API Test:** Postman

## 🏁 Projeyi Başlatma

Bu bölüm, projenin backend ve frontend katmanlarını yerel makinenizde kurup çalıştırmanız için gerekli adımları içerir.

### ✅ Ön Gereksinimler

Başlamadan önce sisteminizde aşağıdaki araçların kurulu olduğundan emin olun:

* [**Docker**](https://www.docker.com/products/docker-desktop)
* [**Git**](https://git-scm.com/)
* [**Node.js & npm**](https://nodejs.org/) (Frontend için gerekli)
* [**Java Development Kit (JDK)**](https://www.oracle.com/java/technologies/downloads/) (Eğer servisleri manuel derlemek isterseniz)
* [**Maven**](https://maven.apache.org/download.cgi) (Eğer servisleri manuel derlemek isterseniz)

### 🛠️ Kurulum ve Çalıştırma

Projeyi çalıştırmak için backend (mikroservisler) ve frontend uygulamalarını ayrı ayrı başlatmanız gerekmektedir.

#### 1. Backend'i Çalıştırma (Docker ile)

Backend servislerini çalıştırmanın en kolay ve tavsiye edilen yolu Docker Compose kullanmaktır.

1.  **Projeyi Klonlayın:**
    Projeyi GitHub'dan yerel makinenize klonlayın.
    ```sh
    git clone [https://github.com/Monarch34/microservice-term-project.git](https://github.com/Monarch34/microservice-term-project.git)
    ```

2.  **Proje Dizinine Gidin:**
    ```sh
    cd microservice-term-project
    ```

3.  **Projeyi Docker Compose ile Başlatın:**
    Projenin ana dizinindeyken aşağıdaki komutu çalıştırın.
    ```sh
    docker-compose up --build
    ```
    * `--build` parametresi, kodda bir değişiklik yaptıysanız imajların yeniden oluşturulmasını sağlar.
    * Servislerin arka planda çalışmasını isterseniz `-d` (detached mode) parametresini ekleyebilirsiniz: `docker-compose up --build -d`.

4.  **Çalışan Servisleri Kontrol Edin:**
    Tüm konteynerlerin başarıyla başlatıldığını ve çalıştığını görmek için yeni bir terminalde aşağıdaki komutu çalıştırın:
    ```sh
    docker-compose ps
    ```
    Tüm servislerin `State` kolonunda `Up` veya `Running` yazdığını görmelisiniz.

#### 2. Frontend'i Çalıştırma

1.  **Frontend Klasörüne Gidin:**
    Yeni bir terminal açın ve projenin içindeki frontend klasörüne gidin.
    ```sh
    cd path/to/your/frontend-folder # Örn: cd microservice-term-project/frontend-app
    ```

2.  **Bağımlılıkları Yükleyin:**
    Gerekli Node.js paketlerini yükleyin.
    ```sh
    npm install
    ```

3.  **Frontend Uygulamasını Başlatın:**
    Uygulamayı geliştirme modunda başlatın.
    ```sh
    npm start
    ```
    Uygulama genellikle `http://localhost:3000` adresinde çalışmaya başlayacaktır.

### 🛑 Projeyi Durdurma

* **Backend'i Durdurma:** Backend servislerinin çalıştığı terminalde `docker-compose down` komutunu çalıştırın.
* **Frontend'i Durdurma:** Frontend uygulamasının çalıştığı terminalde `Ctrl + C` tuş kombinasyonunu kullanın.

## 📡 API Endpointleri

Proje ayağa kalktıktan sonra API Gateway üzerinden aşağıdaki endpoint'lere istek atabilirsiniz. Varsayılan olarak API Gateway `http://localhost:[PORT]` adresinde çalışır. (`docker-compose.yml` dosyasından portu kontrol edebilirsiniz, genellikle `8080`, `9090` veya `8765` gibi bir porttur).

**Örnek Endpointler:**

* **Auth Service:**
    * `POST /auth/register`
    * `POST /auth/login`
* **Product Service:**
    * `GET /product`
    * `POST /product`

> **Not:** Detaylı endpoint listesi ve istek/cevap formatları için her servisin kendi `Controller` dosyalarını veya Swagger dokümantasyonunu (eğer varsa) inceleyebilirsiniz.
