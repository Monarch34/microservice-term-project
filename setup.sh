#!/bin/bash

# Hata durumunda betiğin çalışmasını durdurur.
set -e

# Terminal çıktıları için renk kodları
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # Renk yok

# --- Yapılandırma Değişkenleri ---
GIT_REPO_URL="https://github.com/Monarch34/microservice-term-project.git"
PROJECT_DIR="microservice-term-project"
# Lütfen projenizdeki frontend klasörünün adını buraya girin.
FRONTEND_DIR="frontend-app"

echo -e "${BLUE}Mikroservis Projesi Kurulum Betiği Başlatılıyor...${NC}"
echo "-----------------------------------------------------"

# --- 1. Adım: Bağımlılık Kontrolü ---
echo -e "${YELLOW}Gerekli araçlar kontrol ediliyor (Git, Docker, Node.js)...${NC}"

command -v git >/dev/null 2>&1 || { echo >&2 "HATA: Git kurulu değil. Lütfen önce Git'i kurun."; exit 1; }
command -v docker >/dev/null 2>&1 || { echo >&2 "HATA: Docker kurulu değil. Lütfen önce Docker'ı kurun ve çalışır durumda olduğundan emin olun."; exit 1; }
command -v node >/dev/null 2>&1 || { echo >&2 "HATA: Node.js kurulu değil. Lütfen önce Node.js ve npm'i kurun."; exit 1; }

echo -e "${GREEN}Tüm gerekli araçlar sistemde mevcut.${NC}"
echo "-----------------------------------------------------"


# --- 2. Adım: Proje Kurulumu ---
if [ -d "$PROJECT_DIR" ]; then
  echo -e "${YELLOW}Proje klasörü ($PROJECT_DIR) zaten mevcut. Klonlama adımı atlanıyor.${NC}"
else
  echo -e "${BLUE}Proje GitHub'dan klonlanıyor...${NC}"
  git clone $GIT_REPO_URL
  echo -e "${GREEN}Proje başarıyla klonlandı.${NC}"
fi

cd $PROJECT_DIR
echo "Proje dizinine geçildi: $(pwd)"
echo "-----------------------------------------------------"


# --- 3. Adım: Backend'i Başlatma ---
echo -e "${BLUE}Backend servisleri Docker Compose ile başlatılıyor...${NC}"
echo -e "${YELLOW}(Bu işlem biraz zaman alabilir, lütfen bekleyin)${NC}"
docker-compose up --build -d

echo -e "${GREEN}Backend servisleri başarıyla arka planda başlatıldı!${NC}"
echo "Çalışan servisleri kontrol etmek için 'docker-compose ps' komutunu kullanabilirsiniz."
echo "-----------------------------------------------------"


# --- 4. Adım: Frontend'i Başlatma ---
echo -e "${BLUE}Frontend uygulaması kuruluyor ve arka planda başlatılıyor...${NC}"

if [ -d "$FRONTEND_DIR" ]; then
  cd $FRONTEND_DIR
  echo "Frontend dizinine geçildi: $(pwd)"

  echo -e "${YELLOW}Gerekli npm paketleri yükleniyor (npm install)...${NC}"
  npm install

  echo -e "${GREEN}Paketler başarıyla yüklendi.${NC}"
  echo -e "${BLUE}Frontend uygulaması arka planda başlatılıyor...${NC}"

  # npm start komutunu arka planda (&) çalıştırır ve loglarını bir dosyaya yazar.
  # Bu sayede terminali kapatsanız bile uygulama çalışmaya devam eder.
  nohup npm start > frontend.log 2>&1 &

  cd .. # Ana proje dizinine geri dön
else
  echo >&2 "HATA: Frontend klasörü ($FRONTEND_DIR) bulunamadı. Lütfen betik içindeki FRONTEND_DIR değişkenini doğru klasör adıyla güncelleyin."
  exit 1
fi

echo "-----------------------------------------------------"
echo -e "${GREEN}🎉 PROJE BAŞARIYLA AYAĞA KALDIRILDI! 🎉${NC}"
echo ""
echo -e "Backend servisleri Docker üzerinde çalışıyor."
echo -e "Frontend uygulaması arka planda başlatıldı ve genellikle ${YELLOW}http://localhost:3000${NC} adresinde erişilebilir."
echo ""
echo -e "${BLUE}Projeyi durdurmak için:${NC}"
echo -e "1. Backend'i durdurmak için proje ana dizininde: ${YELLOW}docker-compose down${NC}"
echo -e "2. Frontend'i durdurmak için: ${YELLOW}kill \$(lsof -t -i:3000)${NC} (macOS/Linux)"
echo "-----------------------------------------------------"

