/**
 * Coşkun Yaycı - Product Data
 * Güncel Fiyat Listesi - 2026
 */

window.products = [
  { 
    id: 1, 
    name: "Fıstıklı Baklava", 
    price: "1.800,00 ₺", 
    img: "img/mekik_baklava.jpg", 
    desc: "Bol Antep fıstığı ile hazırlanan klasik kare baklava. Geleneksel yöntemlerle, özenle hazırlanır.", 
    meta: "1 kg", 
    badges: ["🚫 Glikozsuz", "🔥 Odun Ateşi", "Çok Satan"],
    nutrition: { calories: "480 kcal", protein: "9g", fat: "26g", carbs: "54g", sugar: "36g" },
    allergens: ["gluten", "dairy", "nuts"]
  },
  { 
    id: 2, 
    name: "Özel Kare Baklava", 
    price: "2.200,00 ₺", 
    img: "img/kare_baklava.jpg", 
    desc: "Seçilmiş en kaliteli fıstıklarla hazırlanan özel üretim kare baklava. Premium kalite.", 
    meta: "1 kg", 
    badges: ["🚫 Glikozsuz", "🔥 Odun Ateşi", "Özel Ürün"],
    nutrition: { calories: "500 kcal", protein: "10g", fat: "28g", carbs: "54g", sugar: "38g" },
    allergens: ["gluten", "dairy", "nuts"]
  },
  { 
    id: 3, 
    name: "Havuç Dilimi", 
    price: "2.100,00 ₺", 
    img: "img/havuc_dilimi.jpg", 
    desc: "İçinde bol ceviz ve nazikçe serbest bırakılan şerbet. Geleneksel havuç dilimi şeklinde.", 
    meta: "1 kg", 
    badges: ["🚫 Glikozsuz", "🔥 Odun Ateşi", "Günlük Üretim"],
    nutrition: { calories: "450 kcal", protein: "7g", fat: "22g", carbs: "58g", sugar: "38g" },
    allergens: ["gluten", "dairy", "nuts"]
  },
  { 
    id: 4, 
    name: "Dolama", 
    price: "2.500,00 ₺", 
    img: "img/dolama.jpg", 
    desc: "El sarımı dolama, yoğun fıstıklı ve çıtır. Saray tatlılarının en özeli.", 
    meta: "1 kg", 
    badges: ["🚫 Glikozsuz", "🔥 Odun Ateşi", "El Yapımı"],
    nutrition: { calories: "520 kcal", protein: "10g", fat: "30g", carbs: "54g", sugar: "40g" },
    allergens: ["gluten", "dairy", "nuts"]
  },
  { 
    id: 5, 
    name: "Açık Şöbiyet", 
    price: "2.300,00 ₺", 
    img: "img/sobiyet.jpg", 
    desc: "Kaymak dolgulu, açık katlı şöbiyet. Geleneksel tarif, zengin içerik.", 
    meta: "1 kg", 
    badges: ["🚫 Glikozsuz", "🔥 Odun Ateşi", "Kaymaklı"],
    nutrition: { calories: "480 kcal", protein: "8g", fat: "26g", carbs: "56g", sugar: "40g" },
    allergens: ["gluten", "dairy", "nuts"]
  },
  { 
    id: 6, 
    name: "İnce Şöbiyet", 
    price: "2.300,00 ₺", 
    img: "img/yaprak_sobiyet.jpg", 
    desc: "İnce yapraklı, hafif ve çıtır şöbiyet. Zarif sunumuyla öne çıkar.", 
    meta: "1 kg", 
    badges: ["🚫 Glikozsuz", "🔥 Odun Ateşi", "Zarif"],
    nutrition: { calories: "470 kcal", protein: "7g", fat: "24g", carbs: "58g", sugar: "38g" },
    allergens: ["gluten", "dairy", "nuts"]
  },
  { 
    id: 7, 
    name: "Cevizli Baklava", 
    price: "1.600,00 ₺", 
    img: "", 
    desc: "Taze ceviz içi ile hazırlanan ekonomik ve lezzetli baklava seçeneği.", 
    meta: "1 kg", 
    badges: ["🚫 Glikozsuz", "🔥 Odun Ateşi", "Cevizli"],
    nutrition: { calories: "440 kcal", protein: "8g", fat: "24g", carbs: "50g", sugar: "34g" },
    allergens: ["gluten", "dairy", "nuts"]
  },
  { 
    id: 8, 
    name: "Midye", 
    price: "2.300,00 ₺", 
    img: "img/midye.jpg", 
    desc: "Özel sarım midye şeklinde baklava, kıvamı yumuşak. El sanatının göstergesi.", 
    meta: "1 kg", 
    badges: ["🚫 Glikozsuz", "🔥 Odun Ateşi", "Özel Ürün"],
    nutrition: { calories: "480 kcal", protein: "9g", fat: "26g", carbs: "54g", sugar: "38g" },
    allergens: ["gluten", "dairy", "nuts"]
  },
  { 
    id: 9, 
    name: "Burmalı", 
    price: "2.300,00 ₺", 
    img: "img/burma_kadayif.jpg", 
    desc: "Burma şeklinde sarılmış, çıtır kadayıf ve bol fıstık.", 
    meta: "1 kg", 
    badges: ["🚫 Glikozsuz", "🔥 Odun Ateşi", "Kadayıf"],
    nutrition: { calories: "460 kcal", protein: "8g", fat: "24g", carbs: "56g", sugar: "36g" },
    allergens: ["gluten", "dairy", "nuts"]
  },
  { 
    id: 10, 
    name: "Fıstıklı Kurabiye", 
    price: "2.000,00 ₺", 
    img: "img/fistikli_kurabiye.jpg", 
    desc: "İçinde bol Antep fıstığı bulunan çıtır kurabiye. Geleneksel ev yapımı tarif.", 
    meta: "1 kg", 
    badges: ["🚫 Glikozsuz", "🔥 Odun Ateşi", "Bol Fıstıklı"],
    nutrition: { calories: "520 kcal", protein: "10g", fat: "30g", carbs: "52g", sugar: "24g" },
    allergens: ["gluten", "dairy", "nuts", "egg"]
  },
  { 
    id: 11, 
    name: "Tuzlu Fıstık", 
    price: "1.600,00 ₺", 
    img: "img/tuzlu_fistik.jpg", 
    desc: "Özenle kavrulmuş, tuzlu atıştırmalık fıstık. Çerezlik.", 
    meta: "1 kg", 
    badges: ["🚫 Glikozsuz", "🔥 Odun Ateşi", "Kavrulmuş"],
    nutrition: { calories: "580 kcal", protein: "20g", fat: "48g", carbs: "16g", sugar: "4g" },
    allergens: ["nuts"]
  },
  { 
    id: 12, 
    name: "Su Böreği", 
    price: "1.500,00 ₺", 
    img: "img/su_boregi.jpg", 
    desc: "Klasik su böreği, ince yufka ve hafif tuzlu lezzet. Kahvaltılara yakışır.", 
    meta: "1 kg", 
    badges: ["🚫 Glikozsuz", "🔥 Odun Ateşi", "Kahvaltılık"],
    nutrition: { calories: "340 kcal", protein: "12g", fat: "16g", carbs: "40g", sugar: "2g" },
    allergens: ["gluten", "dairy", "egg"]
  },
  { 
    id: 13, 
    name: "Özel Dilim", 
    price: "1.900,00 ₺", 
    img: "img/mekik_baklava.jpg", 
    desc: "Özel açma tekniğiyle hazırlanan, görsel şölen sunan baklava.", 
    meta: "1 kg", 
    badges: ["🚫 Glikozsuz", "🔥 Odun Ateşi", "Görsellik"],
    nutrition: { calories: "470 kcal", protein: "8g", fat: "24g", carbs: "56g", sugar: "36g" },
    allergens: ["gluten", "dairy", "nuts"]
  },
  { 
    id: 14, 
    name: "Kuş Gözü", 
    price: "2.100,00 ₺", 
    img: "img/yesil_midye.jpg", 
    desc: "Kuş gözü şeklinde hazırlanan özel baklava. Yoğun fıstıklı.", 
    meta: "1 kg", 
    badges: ["🚫 Glikozsuz", "🔥 Odun Ateşi", "Yoğun Fıstık"],
    nutrition: { calories: "490 kcal", protein: "9g", fat: "26g", carbs: "56g", sugar: "38g" },
    allergens: ["gluten", "dairy", "nuts"]
  },
  { 
    id: 15, 
    name: "Özel Karışık", 
    price: "2.300,00 ₺", 
    img: "img/ozel_karisik.jpg", 
    desc: "Seçkin parçalarla hazırlanmış özel karışım. En iyiler bir arada.", 
    meta: "1 kg", 
    badges: ["🚫 Glikozsuz", "🔥 Odun Ateşi", "Premium Seçim"],
    nutrition: { calories: "480 kcal", protein: "9g", fat: "26g", carbs: "54g", sugar: "38g" },
    allergens: ["gluten", "dairy", "nuts"]
  },
  { 
    id: 16, 
    name: "Normal Karışık", 
    price: "2.100,00 ₺", 
    img: "img/karisik.jpg", 
    desc: "Çeşitli baklava türlerinden oluşan ekonomik karışık kutu.", 
    meta: "1 kg", 
    badges: ["🚫 Glikozsuz", "🔥 Odun Ateşi", "Çeşitli"],
    nutrition: { calories: "460 kcal", protein: "8g", fat: "24g", carbs: "56g", sugar: "36g" },
    allergens: ["gluten", "dairy", "nuts"]
  }
];

// Alerjen açıklamaları
window.allergenInfo = {
  gluten: { icon: '🌾', name: 'Gluten', desc: 'Buğday içerir' },
  dairy: { icon: '🥛', name: 'Süt Ürünü', desc: 'Süt ve süt ürünleri içerir' },
  nuts: { icon: '🥜', name: 'Kuruyemiş', desc: 'Fıstık/Ceviz içerir' },
  egg: { icon: '🥚', name: 'Yumurta', desc: 'Yumurta içerir' }
};

// Besin değeri açıklamaları
window.nutritionLabels = {
  calories: 'Enerji',
  protein: 'Protein',
  fat: 'Yağ',
  carbs: 'Karbonhidrat',
  sugar: 'Şeker'
};
