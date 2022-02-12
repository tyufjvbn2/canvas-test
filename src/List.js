import React, {useRef, useState, useEffect, useCallback} from "react"

function List({polygonStore, deletePolygon}) {
    console.log("polygon check", polygonStore)
    
    if(!polygonStore) {
        return <>
        </>;
    }

    return (
        <>
            {polygonStore.map((el,i) => {
                return (
                    <li key={i.toString()}>
                        Polygon {i+1}
                    </li>
                )
            })}
        </>
    )
}

export default React.memo(List);