import image from '../../../assets/images/verifying.png'
function Verifying() {
    return (
        <div className="text-center px-4 my-10">
            <img src={image} alt="" className='w-64 h-64 object-contain mx-auto' />
            <h2 className="text-xl md:text-2xl font-bold">We are verifying your account</h2>
            <p>This may take some time.</p>
        </div>
    )
}

export default Verifying