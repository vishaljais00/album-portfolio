import React from 'react'
import {Navbar } from 'react-bootstrap'
import styles from './navbar.module.css'

export default function TopNav() {
  return (
    <Navbar className={styles.topHead} variant="dark" expand="lg">
    <Navbar.Brand href="#" className={styles.brand}>
      <img
        alt=""
        src="/assets/gallaryBrand.png"
        width="60"
        height="60"
        className="p-2 d-inline-block align-center"
      />{' '} PortFolio</Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
  </Navbar>
  )
}
