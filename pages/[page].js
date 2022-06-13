import Head from 'next/head'

export default function Page({ pageDetails }) {
    const { title, body } = pageDetails.node;

    return (
        <>
            <Head>
                <title>{ title } | David Salter Flowers</title>
            </Head>
            <h1 className='text-2xl font-bold my-4'>{ title }</h1>
            <div className="" dangerouslySetInnerHTML={{ __html: body }}></div>
        </>
    )
}

export async function getStaticProps({ params }) {

    const data = () => `query {
                pages(first: 1, query: "handle:${params.page}") {
                edges { 	    
                    node {
                        title       
                        body       
                    }   	
                } 	
            }}`;
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
        pageDetails: req.data.pages.edges[0],
      }
    }
  }
  
export async function getStaticPaths() {

    const res = await fetch('https://next-dev-store-uk.myshopify.com/admin/api/2022-04/pages.json', {
        headers: {
            'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN
        }
    });
    const req = await res.json();

    const paths = req.pages.map(page => {
        return { params: { page: page.handle } }
    });

    return {
        paths,
        fallback: false
    };
}
  

