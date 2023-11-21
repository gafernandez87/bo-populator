"use client";
import { usePathname } from 'next/navigation'
import Link from 'next/link'

import styles from "./Navbar.module.css";

export default function Navbar() {
    const pathname = usePathname()

    return (
        <nav className={styles.container}>
            <Link href="/" className={pathname === '/' ? styles.selected : ''}>Home</Link>
            <Link href="/populate" className={pathname === '/populate' ? styles.selected : ''}>Populator</Link>
            <Link href="/image-scrapper" className={pathname === '/image-scrapper' ? styles.selected : ''}>Image Scrapper</Link>
            <Link href="/data-sync" className={pathname === '/data-sync' ? styles.selected : ''}>Data Sync</Link>
        </nav>
    );
}
