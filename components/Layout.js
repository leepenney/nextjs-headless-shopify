import Nav from './Nav'
import Footer from './Footer'

export default function Layout({ children }) {
    return (
        <>
        <Nav />
        <main className="w-3/4 xs:w-full ml-auto mr-auto">{children}</main>
        <Footer />
        </>
    )
}