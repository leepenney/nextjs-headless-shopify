
import Image from 'next/image';

export default function ProductCard({ product }) {

    return (
        <div className="product-card flex justify-center" key="product.id">
            <div className="rounded-lg shadow-lg bg-white max-w-sm">
            <a href={ `/product/${product.node.handle}_${product.node.id.substring(product.node.id.lastIndexOf('/')+1)}` }>
                <Image className="rounded-t-lg" src={ product.node.featuredImage.url.toString() } layout="fill" objectFit='contain' height="225" />
                <div className="p-6">
                <h5 className="text-gray-900 text-xl font-medium mb-2">{ product.node.title }</h5>
                <p>&pound;{ parseFloat(product.node.priceRange.minVariantPrice.amount).toFixed(2) }</p>
                <button type="button" className="w-full inline-block px-6 py-2.5 bg-purple-600 text-white 
                font-bold text-xs leading-tight uppercase rounded shadow-md hover:bg-purple-700 hover:shadow-lg 
                focus:bg-purple-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-purple-800 active:shadow-lg 
                transition duration-150 ease-in-out">MORE DETAILS</button>
                </div>
            </a>
            </div>
        </div>
    )

}