import Head from 'next/head'
import ProductCard from '../../components/ProductCard';

export default function ProductListing({ collection }) {
    const { handle, title, collectionId, products } = collection;

    return (
        <>
            <Head>
                <title>{ title } | David Salter Flowers</title>
            </Head>
            <h1 className='text-2xl font-bold my-4'>{ title }</h1>
            <div className="grid md:grid-cols-4 sm:grid-cols-1 gap-y-8">
              {products.edges.map((product) => (
                <ProductCard product={product} />
              ))}
            </div>
        </>
    )
}

export async function getStaticProps({ params }) {

  const data = () => `query {
    collection(handle:"${params.category}") {
      handle
      title
      id
      products(first: 20, sortKey:TITLE) {
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
      collection: req.data.collection,
    }
  }
}
  
export async function getStaticPaths() {

    const data = () => `query {
      collections(first: 250) {
        edges {
          node {
            handle
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

    const paths = req.data.collections.edges.map(collection => {
        return { params: { category: `${collection.node.handle}` } }
    });

    return {
        paths,
        fallback: false
    };
}
  

