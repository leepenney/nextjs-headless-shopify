import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'

export default function Cart() {

    const [cartData, setCartData] = useState(null);
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        let cartDetails = JSON.parse(localStorage.getItem( 'cartDetails' ));

        if (cartDetails) {
            const data = () => `query {
                cart(id:"${cartDetails.id}") {
                id
                checkoutUrl
                estimatedCost {
                    subtotalAmount {
                        amount
                        currencyCode
                    }
                    totalAmount {
                        amount
                        currencyCode
                    }
                }
                lines(first:50) {
                    edges {
                    node {
                        id
                        quantity
                        merchandise {
                        ... on ProductVariant {
                            id
                            product {
                                title
                                handle
                                id
                            }
                            image {
                                url
                            }
                            priceV2 {
                                amount
                                currencyCode
                            }
                        }
                        }
                    }
                    }
                }
                }
            }`;
            fetch(`https://next-dev-store-uk.myshopify.com/api/2022-04/graphql.json`, {
                method: 'POST',
                headers: {
                    'X-Shopify-Storefront-Access-Token': process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
                    "Content-Type": "application/graphql"
                },
                body: data()
            })
                .then((res) => res.json())
                .then((data) => {
                    setCartData(data.data.cart);
                    setLoading(false);
                })
        }
        if (!cartDetails) setLoading(false)
    }, []);

    if (isLoading) return (
        <>
            <Head>
                <title>Cart | David Salter Flowers</title>
            </Head>
            <h1 className='text-2xl font-bold my-4'>Cart</h1>
            <p>Loading cart....</p>
        </>
    )
    if (!cartData) return (
        <>
            <Head>
                <title>Cart | David Salter Flowers</title>
            </Head>
            <h1 className='text-2xl font-bold my-4'>Cart</h1>
            <p>No cart found or cart expired</p>
        </>
    )

    const removeCartedItem = async (e) => {
        e.preventDefault();
        const product = e.target.dataset.lid;
        const cart = cartData.id;

        const query = `mutation {
                cartLinesRemove(
                cartId: "${cart}",
                lineIds: [
                "${product}"
            ]) {
                cart {
                id
                checkoutUrl
                estimatedCost {
                    subtotalAmount {
                        amount
                        currencyCode
                    }
                    totalAmount {
                        amount
                        currencyCode
                    }
                }
                lines(first: 50) {
                    edges {
                    node {
                        id
                        quantity
                        merchandise {
                        ... on ProductVariant {
                            id
                            product {
                                title
                                handle
                                id
                            }
                            image {
                                url
                            }
                            priceV2 {
                                amount
                                currencyCode
                            }
                        }
                        }
                    }
                    }
                }
                }
            }
        }`;
        const data = () => query;

        fetch(`https://next-dev-store-uk.myshopify.com/api/2022-04/graphql.json`, {
            method: 'POST',
            headers: {
                'X-Shopify-Storefront-Access-Token': process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
                "Content-Type": "application/graphql"
            },
            body: data()
        })
            .then((res) => res.json())
            .then((data) => {
                setCartData(data.data.cartLinesRemove.cart);
                let cartId = data?.data?.cartLinesRemove?.cart?.id;
                let existingCartDetails = {};
                if (localStorage.getItem('cartDetails') !== null) {
                    existingCartDetails = JSON.parse(localStorage.getItem('cartDetails'));
                }
                let createdDate = new Date();
                if (Object.keys(existingCartDetails).length > 0) {
                    createdDate = new Date(existingCartDetails.createdDate)
                }

                let items = data?.data?.cart?.lines?.edges;
                let totalItems = 0;
                if (items && items.length > 0) {
                    items.map((item) => {
                        totalItems = totalItems + parseInt(item.node.quantity);
                    });
                }

                localStorage.setItem( 'cartDetails', JSON.stringify({ 
                    'id': cartId, 
                    'createdDate': createdDate, 
                    'totalItems': totalItems
                }));
            })
    }

    return (
        <>
            <Head>
                <title>Cart | David Salter Flowers</title>
            </Head>
            <h1 className='text-2xl font-bold my-4'>Cart</h1>
            
            { !!cartData && cartData?.lines?.edges.length > 0 ? (
                <>
                <table className="cart w-full block md:table">
                    <thead className='hidden md:table-header-group'>
                    <tr className="border-b-2 border-t-2 border-gray-200">
                        <th></th>
                        <th className="text-left">Item</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th className="text-right p-2">Item Total</th>
                    </tr>
                    </thead>
                    <tbody className='block md:table-row-group'>
                        { cartData.lines.edges.map((product) => (
                            <tr key={product.node.id} className="flex flex-col items-center md:table-row">
                                <td className="py-3"><a href={ '/product/' + product.node.merchandise.product.handle + '_' +
                                    product.node.merchandise.product.id.substring(
                                        product.node.merchandise.product.id.lastIndexOf('/')+1) }>
                                        <Image src={ product.node.merchandise.image.url } height="100" width="100" />
                                    </a>
                                </td>
                                <td>
                                    { product.node.merchandise.product.title }<br />
                                    <a href="#" onClick={ removeCartedItem } data-lid={ product.node.id } className="text-red-700 text-sm">Delete</a>
                                </td>
                                <td className="text-center">{ product.node.quantity }</td>
                                <td className="text-center">&pound;{ parseFloat(product.node.merchandise.priceV2.amount).toFixed(2) }</td>
                                <td className="text-right pr-2">&pound;{ parseFloat(product.node.merchandise.priceV2.amount * product.node.quantity).toFixed(2) }</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot className='block md:table-footer-group'>
                        <tr className='md:border-t-2 md:border-gray-200'>
                            <td colSpan={4} className="text-right font-bold text-lg py-8">Total:</td>
                            <td className='text-right text-lg'>&pound;{ parseFloat(cartData.estimatedCost.totalAmount.amount).toFixed(2) }</td>
                        </tr>
                    </tfoot>
                </table>
                <div className="totals flex justify-end">
                    <Link href={ cartData.checkoutUrl }><a className={ `
                        inline-block
                        px-7 
                        py-3.5 
                        bg-purple-600 
                        text-white 
                        font-bold 
                        text-xs 
                        leading-tight 
                        uppercase 
                        rounded 
                        shadow-md 
                        hover:bg-purple-700 
                        hover:shadow-lg 
                        focus:bg-purple-700 
                        focus:shadow-lg 
                        focus:outline-none 
                        focus:ring-0 
                        active:bg-purple-800 
                        active:shadow-lg 
                        transition duration-150 ease-in-out` }>Checkout</a></Link>
                </div>
                </>
            ) : (
                <p>No cart found or cart has expired.</p>
            )
            }
        </>
    )
}

/* export async function getInitialProps({ params }) {

    try {
        const cartDetails = JSON.parse(localStorage.getItem( 'cartDetails' ));
    } catch(e) {}

    console.log(`cartDetails: ${cartDetails}`);

    let returnData = null

    if (typeof(cartDetails) !== "undefined") {
        const data = () => `query {
            cart(id:"${cartDetails.id}") {
            id
            checkoutUrl
            lines(first:50) {
                edges {
                node {
                    id
                    quantity
                    merchandise {
                    __typename
                    ... on ProductVariant {
                        id,
                        title
                        image {
                        url
                        }
                        priceV2 {
                        amount
                        currencyCode
                        }
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
        returnData = req.data.cart;
    }

    return {
      props: {
        cartDetails: returnData,
      }
    }
  } */
  


