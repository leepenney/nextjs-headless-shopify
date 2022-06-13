import Link from 'next/link'
import { useState, useEffect } from 'react'

const Nav = () => {

    const [cartQty, setCartQty] = useState(0);

    const updateCartedItems = () => {
        const cartDetails = localStorage.getItem('cartDetails');
        try {
            setCartQty(parseInt(JSON.parse(cartDetails).totalItems));
        } catch(e) {}
    }

    useEffect(() => {
        updateCartedItems();
        window.addEventListener('storage', () => {
            updateCartedItems();
        });
        setInterval(() => updateCartedItems(), 1000);
    },[]);

    return (
        <nav className="bg-green-700 text-white grid auto-cols-auto md:grid-cols-6 pt-8 px-8">
            <a href="/" className="inline-block mb-5 mb:mb-0 text-2xl">
                <svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="682.667" height="682.667" viewBox="0 0 512 512" className="fill-current h-9 w-9 inline">
                    <path d="M393 1.5c-10.2 2.5-22.3 9-32 17.3l-3.4 3-3.7-2.9c-2.1-1.6-6.2-4.1-9.2-5.5C320 2.2 294.4 14.7 278.1 46c-17.2 33-19.7 84.5-6.1 121.9 5.9 16 12.6 26.9 23.1 37.1l6.6 6.5-3.3 4.5c-12.9 17.6-19.4 49.3-21.2 102.9l-.7 20.4-5.4-7.2c-8.3-11.3-23.2-22.5-34.3-26.1-2.1-.6-3.8-1.4-3.8-1.6 0-.3 1.1-2.7 2.5-5.4 12.6-24.9 14.3-66.1 4.1-101.3-11-37.5-31.5-63.9-56.5-72.4-15.4-5.2-30.7-1.5-43.2 10.4l-5.8 5.5-6.3-3.6C97.2 120.5 67.7 126 55 151c-4.4 8.7-6.1 15.6-6.7 27.6-.5 9.9.3 18.3 3 32.7.1.5-3 1.9-7 3.1-25.7 8.3-40.2 30-36.4 54.6 4.7 30.3 33 61.4 73.3 80.5 12.1 5.7 28.3 11.1 41.1 13.6 14.6 2.9 36.1 2.9 47.8.1 19.8-4.8 32.2-13.6 39.4-27.9 1.4-2.8 2.5-5.9 2.5-6.8 0-2.6 5.8-7.5 8.9-7.5 4.2.1 15.4 4.4 20.7 8.1 29.4 20.1 47.6 76.2 50 153.9.7 22 1.3 25.4 5.4 27.5 3.4 1.8 5.1 1.9 8.3.4 4.5-2.1 5.1-4.3 4.9-20.4-.5-36.9-5.5-75.4-13.4-103.5l-2.4-8.5.7-38c.9-47.7 2.8-69 7.9-89.7 2.1-8.6 7.3-20.6 10.7-24.7l1.9-2.3 5.8 6c18.8 19.7 51.8 22.3 90.3 7 20.3-8.1 39.3-20.8 56.9-38.3 37.3-37.1 46.7-79.3 23.4-104.8-7.7-8.4-20-14.1-35.1-16.1l-4.6-.7-.6-12.7c-.8-18.3-3.1-27.7-9.9-40.4-3.5-6.5-11.3-14.8-17.3-18.3-8.6-5.1-20.7-6.6-31.5-4zm21.8 19.7c11.5 5.8 18.3 22.2 18.6 44.6.1 12.7.1 12.6-7.3 13.7-5.4.8-24.9 7.3-30.9 10.4-2.2 1.1-4.5 2.1-5 2.1-.6 0-1.3-2.5-1.7-5.5-1.6-13.4-8-32.1-14.8-44l-4-6.9 4.8-4.2c2.7-2.4 7.6-5.8 10.9-7.5 11.6-6.2 20.6-7 29.4-2.7zm-77.3 9c14.9 6.8 28.1 30.3 32.9 58.7.9 5.2 1.6 10.4 1.6 11.5 0 1.5-2.5 3.9-8.2 8.1-16.4 12-34.3 31.9-43.3 48-4.8 8.5-9.2 20.9-10.7 29.7l-1.2 7.2-4.7-5.4c-9.2-10.2-17-28.8-20.4-48.5-2.3-13-2.3-37.6-.1-50.1 6-33.9 21.3-58 38.9-61.3 5.3-1 10.1-.3 15.2 2.1zM455.8 96c19.6 2.6 30.4 13.5 30.3 30.8-.1 19.3-10.1 38.6-31 59.3-26.9 26.7-59.4 41.9-89.7 41.9-31.8 0-45.5-19.8-34.6-49.8 12.7-34.5 51.9-68.1 92.4-79.2 13.3-3.6 21.8-4.4 32.6-3zm-273.5 48.4c17.3 8.4 33.5 33.9 41.2 64.6 3.7 14.8 4.8 26.4 4.2 41.7-.6 15.2-2.4 25-6.3 35.1-2.6 6.7-7.4 15.2-8.5 15.2-.3 0-1.3-2.6-2.3-5.8-7.5-23.9-32.6-49.5-64.8-66.2l-11.7-6.1-.3-7.2c-1.5-37.1 10-66.5 28.7-73.5 4.6-1.8 13.9-.7 19.8 2.2zm-73.3 4.5c3 1.1 7.9 3.5 10.7 5.1l5.3 3-2.4 6.3c-4.3 11.6-7.6 31.2-7.6 46.1 0 6.6-.1 6.8-2.2 6.2-7.7-2.1-23.8-4.8-32.7-5.4l-10.5-.7-1.2-5.5c-2.2-9-2.9-25-1.5-32.2 2.5-12.4 9.5-22.3 17.6-24.8 5-1.5 18.4-.5 24.5 1.9zm-11.9 82.2c42.5 8.4 84.1 38.1 96 68.7 3.3 8.5 3.3 21-.1 27.5-6.7 13.2-21.9 19.7-45.8 19.7-19.6 0-37.8-4.4-58.2-14.1-29-13.8-52.5-36.2-60.5-57.4-2.8-7.3-3.4-19.3-1.3-24.2C33 238 46.1 230.5 66 229.1c11.9-.9 18.9-.4 31.1 2z"/><path d="M419.4 263.6c-53.7 9-95.8 52.7-104.9 108.9-.8 4.9-1.5 12.1-1.5 15.9 0 6.2.5 7.8 4.5 16 24.6 49.4 83.7 73.3 138.3 56 14.6-4.7 16.4-7.8 10.9-19.7-7.7-16.7-23.5-35.3-38.3-45-9.1-6-21.3-12-28.6-14.1-3.2-.9-5.8-2-5.8-2.4 0-.4 2.2-2.3 4.8-4.2 11.3-8.4 23.3-22 31.4-35.5 11.5-19.1 18.8-44.1 18.8-64.2 0-7.6-.2-8.6-2.5-10.8-2.2-2.3-3.2-2.5-10.7-2.4-4.6.1-11.9.7-16.4 1.5zm10.4 24c-5.4 40.5-35.4 77.3-73.2 89.9-7.1 2.4-20.8 5.5-24 5.5-1.4 0-1.4-.5.5-11.5 2.5-14.9 11.4-35.2 20.8-47.7 7-9.3 21.6-22.6 31-28.2 12.5-7.5 31.9-14.2 42.2-14.5l3.6-.1-.9 6.6zm-44 109c17.4 4 31.8 12 44.8 24.9 5 4.9 11 11.9 13.2 15.5l4.1 6.5-4.1 1.2c-7.6 2.3-21.1 3.6-30.5 2.9-24.1-1.7-46.1-11.4-62.2-27.6-6.7-6.7-14.9-17.6-13.9-18.5.3-.3 3.8-1.2 7.9-2 4.1-.8 10.1-2.4 13.4-3.4 6.8-2.3 16-2.1 27.3.5z"/>
                </svg> David Salter
            </a>
            <div className='col-start-1 md:col-start-3 col-span-6 md:col-span-4 text-right'>
                <input type="checkbox" name="toggle-menu" id='toggle-menu' className="hidden" />
                <label htmlFor="toggle-menu">
                    <svg className="fill-current h-12 w-12 absolute right-3 top-8 block md:hidden" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/></svg>
                </label>
                <ul className="hidden mt-5 md:mt-0 md:inline-block">
                    <li className="group relative text-center inline-block">
                        <span className="group cursor-pointer inline-block w-full px-5 py-3 hover:bg-green-500">Products</span>
                        <ul className="overflow-hidden max-h-screen md:max-h-0 w-full md:w-max relative md:absolute top-auto left-0 z-10 bg-green-700 transition-all duration-500 ease-out group-hover:max-h-screen">
                            <li><Link href="/category/fresh-flowers"><a className="block px-5 py-3 hover:bg-green-500">Fresh Flowers</a></Link></li>
                            <li><Link href="/category/dried-flowers"><a className="block px-5 py-3 hover:bg-green-500">Dried Flowers</a></Link></li>
                            <li><Link href="/category/sundries"><a className="block px-5 py-3 hover:bg-green-500">Sundries</a></Link></li>
                        </ul>
                    </li>
                    <li className="text-center inline-block"><Link href="/hire-service"><a className="w-full inline-block px-5 py-3 hover:bg-green-500">Hire Service</a></Link></li>
                    <li className="text-center inline-block"><a href="/weddings-events" className="w-full inline-block px-5 py-3 hover:bg-green-500">Weddings &amp; Events</a></li>
                    <li className="text-center inline-block"><a href="/about-us" className="w-full inline-block px-5 py-3 hover:bg-green-500">About</a></li>
                    <li className="text-center inline-block"><a href="/contact" className="w-full inline-block px-5 py-3 hover:bg-green-500">Contact Us</a></li>
                    <li className="cart-nav-link text-center inline-block">
                        <a href="/cart" className="w-full inline-block h-10 w-10 bg-green-500 rounded-full relative">
                        <div className={ `${ cartQty == 0 ? 'hidden' : '' } absolute inline-block top-1 right-1 bottom-auto left-auto translate-x-2/4 -translate-y-1/2 rotate-0 skew-x-0 skew-y-0 scale-x-100 scale-y-100 p-1 text-xs leading-none text-center whitespace-nowrap align-baseline font-bold bg-red-700 text-white rounded-md z-10` }>{ cartQty }</div>
                            <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="shopping-cart" className="w-5 h-5 fill-current absolute top-3 left-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                <path d="M528.12 301.319l47.273-208C578.806 78.301 567.391 64 551.99 64H159.208l-9.166-44.81C147.758 8.021 137.93 0 126.529 0H24C10.745 0 0 10.745 0 24v16c0 13.255 10.745 24 24 24h69.883l70.248 343.435C147.325 417.1 136 435.222 136 456c0 30.928 25.072 56 56 56s56-25.072 56-56c0-15.674-6.447-29.835-16.824-40h209.647C430.447 426.165 424 440.326 424 456c0 30.928 25.072 56 56 56s56-25.072 56-56c0-22.172-12.888-41.332-31.579-50.405l5.517-24.276c3.413-15.018-8.002-29.319-23.403-29.319H218.117l-6.545-32h293.145c11.206 0 20.92-7.754 23.403-18.681z"/>
                            </svg>
                        </a>
                    </li>
                </ul>
            </div>
        </nav>
    )
}

export default Nav;
