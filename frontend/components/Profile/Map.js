import React from 'react'
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import styles from "../../styles/pages/Order.module.scss"
import { LoadingContext, SidebarContext } from '../../hocs/Layout';
const onMLoad = marker => {
    console.log('marker: ', marker)
}


function MyComponent({ delivery }) {
    const v = `${delivery.address.city} - ${delivery.address.pincode}`
    const { setLoading } = React.useContext(LoadingContext)
    const round = num => Math.round(num * 100)/100
    const center = {
        lat: round(delivery.lat),
        lng:round(delivery.long)
    }
    const containerStyle = {
      width: "80vw",
      height: '70vh'
    };
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: "AIzaSyDLbzKgNlyyjchbtivc9mXcGe4XXcf_VU0"
      })
    
      const [map, setMap] = React.useState(null)
    
      const onLoad = React.useCallback(function callback(map) {
        setLoading(true)
        const bounds = new window.google.maps.LatLngBounds(center);
        map.fitBounds(bounds);
        setMap(map)
        setLoading(false)
      }, [])
    
      const onUnmount = React.useCallback(function callback(map) {
        setMap(null)
      }, [])
    
      return isLoaded ? (
          <div className={styles.map}>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={8}
                onLoad={onLoad}
                onUnmount={onUnmount}
            >
                { /* Child components, such as markers, info windows, etc. */ }
                <>
                    <Marker zIndex={9999} label={v} title={v} position={center} onLoad={onMLoad} />
                </>
            </GoogleMap>
          </div>
      ) : <></>
}

export default React.memo(MyComponent)