import React from "react";

const categories = [
  { 
    name: "Men", 
    img: "https://thehouseofrare.com/cdn/shop/files/BENEDICTDUSKYPURPLE07467.png?v=1739188932&width=540",
    url: "https://www.myntra.com/shop/men"
  },
  { 
    name: "Women", 
    img: "https://cdn.shopify.com/s/files/1/0785/1674/8585/files/Copy_of_Virgio_-_3rd_July2467_copy.jpg?v=1753448872&width=960&crop=center",
    url: "https://www.myntra.com/women-kurtas-kurtis-suits?p=1"
  },
  { 
    name: "Kids", 
    img: "https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/f/9/f96d89dUKSHT1394_1.jpg?rnd=20200526195200&tr=w-1080",
    url: "https://www.myntra.com/boy-tshirts?p=1"
  },
  { 
    name: "Beauty", 
    img: "https://www.byrdie.com/thmb/I43JkwGKKC1vXvh_sD6WK556UMk=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/makeup-brands-tout-1-d5ce2c7cb9ec439a9d683d8602f8cba5.jpg",
    url: "https://www.myntra.com/lipstick?p=1"
  },
  { 
    name: "Electronics", 
    img: "https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/leap-petite-global/dynamic-media/headphones/571h/primary/571H-Primary-Black-Nickel.png",
    url: "https://www.amazon.com/s?k=electronics&crid=9ZTULCRHAKLN&sprefix=elect%2Caps%2C864&ref=nb_sb_ss_p13n-expert-pd-ops-ranker_5_5"
  },
  { 
    name: "Groceries", 
    img: "https://m.media-amazon.com/images/I/81hD14MN91L.jpg",
    url: "https://www.amazon.com/s?k=groceries&crid=2LI49NSTNV0TI&sprefix=Groceries%2Caps%2C504&ref=nb_sb_ss_p13n-expert-pd-ops-ranker_ci_hl-bn-left_1_9"
  },
  { 
    name: "Watch", 
    img: "https://m.media-amazon.com/images/I/61nHUVwR65L._AC_SY679_.jpg",
    url: "https://www.myntra.com/watch?p=1"
  },
  { 
    name: "Toys", 
    img: "https://m.media-amazon.com/images/I/61M8b1BfgEL._AC_UL480_FMwebp_QL65_.jpg",
    url: "https://www.amazon.com/s?k=toys&crid=J4XFAVHXJGCO&sprefix=groc%2Caps%2C730&ref=nb_sb_noss_2"
  },
  { 
    name: "Books", 
    img: "https://m.media-amazon.com/images/I/41IB94ez7VL._SX300_SY300_QL70_FMwebp_.jpg",
    url: "https://www.amazon.com/amz-books/store?ou=psf"
  },
  { 
    name: "Kitchen", 
    img: "https://m.media-amazon.com/images/I/71uA0gVsENL._AC_UL480_FMwebp_QL65_.jpg",
    url: "https://www.amazon.com/s?k=Kitchen&crid=9ZTULCRHAKLN&sprefix=elect%2Caps%2C864&ref=nb_sb_noss_2"
  },
  { 
    name: "Sports", 
    img: "https://m.media-amazon.com/images/I/71y0bD4FHIL._AC_UL480_FMwebp_QL65_.jpg",
    url: "https://www.amazon.com/s?k=cricket+bats&crid=3MSZ7MZ9MJX97&sprefix=cricketbats%2Caps%2C1734&ref=nb_sb_ss_p13n-expert-pd-ops-ranker_1_11"
  },
];

export default function Categories() {

  const handleCategoryClick = (url) => {
    // Open the category page in a new tab
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="category-carousel">
      {categories.map((cat) => (
        <div
          key={cat.name}
          className="category-card"
          onClick={() => handleCategoryClick(cat.url)}
          style={{ cursor: "pointer" }}
        >
          <img src={cat.img} alt={cat.name} />
          <div className="overlay">
            <span>{cat.name}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
