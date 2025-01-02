import { Link } from 'react-router'
import image from '../../../assets/images/verifying.png'
import { Button } from '@/components/ui/button'
function BikeApplicationFinale() {
    return (
        <div className="text-center px-4 my-10">
            <img src={image} alt="" className='w-64 h-64 object-contain mx-auto' />
            <h2 className="text-xl md:text-2xl font-bold">Your application is under review</h2>
            <p className='mb-10'>This may take some time.</p>
            <Link to="/dashboard" >
                <Button className='rounded-full' >
                    Back to Dashboard
                </Button>
            </Link>
        </div>
    )
}

export default BikeApplicationFinale