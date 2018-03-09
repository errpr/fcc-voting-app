import React from 'react';
import { Link } from 'react-router-dom';

export default function FrontPage(props) {
    return(
        <div>
            Front Page
            <Link to='/avacado'>Avacados here.</Link>
        </div>
    )
}