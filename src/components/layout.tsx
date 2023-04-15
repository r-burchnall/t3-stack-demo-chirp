export const PageLayout = ({ children }: React.PropsWithChildren<{}>) => {
    return (
        <main
            className="flex justify-center h-screen">
            <div className="w-full md:max-w-2xl border-x border-slate-400 h-screen">
                {children}
            </div>
        </main>
    )
}