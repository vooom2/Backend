
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Link } from "react-router";
import deliveryman from "../../assets/images/delivery_man.jpeg"
import logo from "../../assets/images/logo_white.png"

export default function Login() {
    const [userType, setUserType] = useState("vehicle-owner")

    return (
        <div className="min-h-screen flex lg:grid-cols-3 bg-black p-6 w-screen">
            <div className="ld:p-8 text-white lg:w-[55vw]">
                <div className="max-w-xl mx-auto space-y-8 mt-10">
                    <div className="space-y-6">
                        <img src={logo} alt="vooom logo" className="w-40" />
                        <ToggleGroup
                            type="single"
                            value={userType}
                            onValueChange={(value) => value && setUserType(value)}
                            className="bg-zinc-900 p-1 rounded-lg grid grid-cols-2"
                        >
                            <ToggleGroupItem
                                value="vehicle-owner"
                                className="data-[state=on]:bg-white data-[state=on]:text-black rounded-md px-3 py-2 text-sm transition-colors"
                            >
                                Vehicle Owner
                            </ToggleGroupItem>
                            <ToggleGroupItem
                                value="riders"
                                className="data-[state=on]:bg-white data-[state=on]:text-black rounded-md px-3 py-2 text-sm transition-colors"
                            >
                                Riders
                            </ToggleGroupItem>
                        </ToggleGroup>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <h2 className="text-xl font-semibold">Welcome Back 👋</h2>
                            <p className="text-sm text-zinc-400">We are happy to have you back</p>
                        </div>

                        <form className="space-y-4">

                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    className="bg-transparent border-zinc-800"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    className="bg-transparent border-zinc-800"
                                />
                            </div>
                            <Link to="/dashboard/unverified">
                                <Button className="w-full bg-white text-black hover:bg-zinc-200 rounded-full py-6">
                                    Login
                                </Button>
                            </Link>

                            <p className="text-sm text-center text-zinc-400">
                                By clicking the "login" button, you agree to{' '}
                                <Link to="#" className="text-orange-500 hover:underline">
                                    Vooom's terms of acceptable use
                                </Link>
                                .
                            </p>
                        </form>

                        <p className="text-sm text-center">
                            Don't have an account?{' '}
                            <Link to="/auth/signup" className="text-orange-500 hover:underline">
                                Create one
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            <div className="relative hidden lg:block lg:w-[45vw] rounded-[2rem]"
                style={{
                    backgroundImage: `url(${deliveryman})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                }}
            >
            </div>
        </div>
    )
}

