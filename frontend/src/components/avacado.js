import React from 'react';
import { Link } from 'react-router-dom';

export default function Avacado(props) {
    return(
        <div>
            Avacado!
            <Link to='/'>Back to the front page</Link>
        </div>
    )
}