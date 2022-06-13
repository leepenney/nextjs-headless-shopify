import Head from 'next/head'
import Image from 'next/image';
import { useState, useEffect } from 'react'

export default function Product({ productDetails }) {
    const { id, title, body_html } = productDetails;
    const [addedToCart, setAddedToCart] = useState(false);

    const addToCart = async (e) => {
        e.preventDefault();
        let prid = e.target.prid.value;
        let vid = e.target.vid.value;
        let qty = e.target.qty.value;

        let existingCartDetails = {};
        if (localStorage.getItem('cartDetails') !== null) {
            existingCartDetails = JSON.parse(localStorage.getItem('cartDetails'));
        }

        let query = `mutation {
            cartCreate(
              input: {
                lines: [
                  {
                    quantity: ${qty}
                    merchandiseId: "gid://shopify/ProductVariant/${vid}"
                  }
                ]
              }
            ) {
              cart {
                id
                lines(first:50) {
                    edges {
                        node {
                            quantity
                        }
                    }
                }
              }
            }
          }`;

        if (Object.keys(existingCartDetails).length > 0) {
            query = `mutation {
                cartLinesAdd(cartId: "${existingCartDetails.id}",
              lines: {
                merchandiseId: "gid://shopify/ProductVariant/${vid}",
                quantity: ${qty}
              }) {
                  cart {
                  id
                  lines(first:50) {
                      edges {
                          node {
                              quantity
                          }
                      }
                  }
                }
            }
          }`;
        }

        const data = () => query;
        
        const res = await fetch(`https://next-dev-store-uk.myshopify.com/api/2022-04/graphql.json`, {
            method: 'POST',
            headers: {
                'X-Shopify-Storefront-Access-Token': 'b000fd782327a92e8f54f94d878cd563',
                "Content-Type": "application/graphql"
            },
            body: data()
        });
        const req = await res.json();

        try {
            let cartId = req.data?.cartCreate?.cart?.id;
            
            let createdDate = new Date();
            if (Object.keys(existingCartDetails).length > 0) {
                cartId = existingCartDetails.id;
                createdDate = new Date(existingCartDetails.createdDate)
            }

            let items = req.data?.cartCreate?.cart?.lines?.edges || req.data?.cartLinesAdd?.cart?.lines?.edges;
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
            setAddedToCart(true);
            setTimeout(() => {
                setAddedToCart(false);
            }, 5000);
        } catch(e) {
            console.error(`Error adding to cart: ${e}`);
        }
    }

    return (
        <>
            <Head>
                <title>{ title } | David Salter Flowers</title>
            </Head>
            <div className={ `flex items-center bg-indigo-400 text-white rounded-md mt-4 overflow-hidden ${ addedToCart ? 'max-h-screen' : 'max-h-0' } transition-all duration-700 ease-out` }>
                <p className="p-3 m-0">Item added to cart</p>
                <div className="flex-grow flex space-x-2 justify-end items-center mr-3">
                    <div>
                        <a href="/cart" className="inline-block px-6 pt-2.5 pb-2 bg-purple-600 text-white font-bold text-xs leading-normal uppercase rounded shadow-md hover:bg-purple-700 hover:shadow-lg focus:bg-purple-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-purple-800 active:shadow-lg transition duration-150 ease-in-out flex align-center">
                            <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="shopping-cart" className="w-3 mr-2 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                <path d="M528.12 301.319l47.273-208C578.806 78.301 567.391 64 551.99 64H159.208l-9.166-44.81C147.758 8.021 137.93 0 126.529 0H24C10.745 0 0 10.745 0 24v16c0 13.255 10.745 24 24 24h69.883l70.248 343.435C147.325 417.1 136 435.222 136 456c0 30.928 25.072 56 56 56s56-25.072 56-56c0-15.674-6.447-29.835-16.824-40h209.647C430.447 426.165 424 440.326 424 456c0 30.928 25.072 56 56 56s56-25.072 56-56c0-22.172-12.888-41.332-31.579-50.405l5.517-24.276c3.413-15.018-8.002-29.319-23.403-29.319H218.117l-6.545-32h293.145c11.206 0 20.92-7.754 23.403-18.681z"/>
                            </svg>
                            Go to Cart
                        </a>
                    </div>
                </div>
            </div>
            <div className='grid sm:grid-cols-1 md:grid-cols-2 md:gap-x-8 my-8'>
                <div>
                    <Image src={ productDetails.image.src.toString() } height="500" width="500" />
                </div>
                <div>
                    <h1 className='leading-tight text-5xl font-medium my-4 mt-0' data-prid={ id }>
                        { title }
                    </h1>
                    <div className="" dangerouslySetInnerHTML={{ __html: body_html }}></div>
                    <p className={ `mt-3 ${ productDetails.variants[0].inventory_quantity > 0 ? 'text-green-600' : 'text-red-600' }` }>
                        { productDetails.variants[0].inventory_quantity > 0 ? 'In stock' : 'Out of stock' }
                    </p>
                    <p className="price font-bold text-xl">&pound;{ parseFloat(productDetails.variants[0].price).toFixed(2) }</p>
                    <form id="addToCart" onSubmit={ addToCart }>
                        <input type="hidden" name="prid" value={id} />
                        <input type="hidden" name="vid" value={productDetails.variants[0].id} />
                        <div className="flex justify-left">
                            <div className="mb-3 xl:w-96">
                                <label htmlFor="qty" className="form-label inline-block mb-2 text-gray-700">
                                    Quantity
                                </label>
                                <input
                                type="number"
                                className="
                                    form-control
                                    block
                                    w-full
                                    px-3
                                    py-1.5
                                    text-base
                                    font-normal
                                    text-gray-700
                                    bg-white bg-clip-padding
                                    border border-solid border-gray-300
                                    rounded
                                    transition
                                    ease-in-out
                                    m-0
                                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
                                "
                                id="qty"
                                defaultValue={1}
                                />
                            </div>
                        </div>
                        <button type="submit" className={ `
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
                        transition duration-150 ease-in-out
                        ${ productDetails.variants[0].inventory_quantity <= 0 ? 'disabled opacity-60 pointer-events-none' : '' }` }>Add to Cart</button>
                    </form>
                    <p className="mt-20">
                        { productDetails.tags.split(',').map((tag) => (
                            <span className="text-xs inline-block py-1 px-2.5 leading-none 
                                text-center whitespace-nowrap align-baseline font-bold 
                                bg-gray-200 text-gray-700 rounded-full mr-1" key={tag}>
                                { tag }
                            </span>
                        ))}
                    </p>
                </div>
            </div>
        </>
    )
}

export async function getStaticProps({ params }) {

    let prid = params.id.split('_')[1];
    const res = await fetch(`https://next-dev-store-uk.myshopify.com/admin/api/2022-04/products/${prid}.json`, {
        headers: {
            'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN
        }
    });
    const req = await res.json();

    return {
      props: {
        productDetails: req.product,
      }
    }
  }
  
export async function getStaticPaths() {

    const res = await fetch('https://next-dev-store-uk.myshopify.com/admin/api/2022-04/products.json?status=active&fields=id,handle', {
        headers: {
            'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN
        }
    });
    const req = await res.json();

    const paths = req.products.map(product => {
        return { params: { id: `${product.handle}_${product.id}` } }
    });

    return {
        paths,
        fallback: false
    };
}
  

