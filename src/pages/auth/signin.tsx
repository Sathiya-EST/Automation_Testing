// import { ModeToggle } from '@/components/shared/ModeToggle'
import { ThemeColorToggle } from '@/components/shared/ThemeColorToggle'
import ThemeModeToggle from '@/components/shared/ThemeModeToggle'
import { Button } from '@/components/ui/button'

const Signin = () => {
    return (
        <div>
            <ThemeModeToggle />
            <ThemeColorToggle />

            {/* <ModeToggle /> */}
            <Button className="bg-background text-foreground" >Theme Button</Button>

            <div className="min-h-screen bg-background text-foreground p-4">
                <h1 className="text-primary">Welcome to the App</h1>
                <p className="text-muted-foreground">This is a customizable theme.</p>
                <button className="bg-primary text-primary-foreground px-4 py-2 rounded">
                    Click Me
                </button>
            </div>
        </div>
    )
}

export default Signin