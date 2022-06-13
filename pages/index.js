import Head from 'next/head'
import Image from 'next/image'
import ProductCard from '../components/ProductCard';
import flowerBanner from '../public/img/flowers-banner.jpg'


export default function Home({ bestsellers }) {
  const { handle, title, collectionId, products } = bestsellers;

  return (
    <div>
      <Head>
        <title>David Salter Flowers</title>
      </Head>

      <main className="my-10">
        <div className="text-center relative h-60">
          <Image src={ flowerBanner } alt="Flower market by Rod Long on Unsplash" 
            className='rounded-xl' layout='fill' objectFit='cover' objectPosition='center' />
          <div className='absolute bottom-5 right-5 text-4xl text-bold drop-shadow text-white'>Welcome to David Salter Flowers</div>
        </div>


        <div>
          <h3 className="font-bold text-2xl text-center my-6">Bestsellers</h3>
            <div className="grid md:grid-cols-4 gap-y-8 sm:grid-cols-1">
              {products.edges.map((product) => (
                <ProductCard product={product} key={ product.node.id } />
              ))}
            </div>
        </div>
      </main>
    </div>
  )
}


export async function getServerSideProps({ params }) {

  const data = () => `query {
    collection(handle:"bestsellers") {
      handle
      title
      id
      products(first: 4, sortKey:TITLE) {
        edges {
          node {
            id
            title
            handle
            featuredImage {
              url
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  }`;
  const res = await fetch(`https://next-dev-store-uk.myshopify.com/api/2022-04/graphql.json`, {
      method: 'POST',
      headers: {
          'X-Shopify-Storefront-Access-Token': process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
          "Content-Type": "application/graphql"
      },
      body: data()
  });
  const req = await res.json();

  return {
    props: {
      bestsellers: req.data.collection,
    }
  }
}