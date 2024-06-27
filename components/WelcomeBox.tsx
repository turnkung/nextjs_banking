type Props = {
    user: User;
}

const WelcomeBox = ({ user }: Props) => {
    return (
        <div className="space-y-2 mb-4">
            <h2 className="text-2xl lg:text-4xl text-white font-medium">
                Welcome, {user?.firstName}
            </h2>
            <p className="text-sm lg:text-base text-[#89b6fd]">
                Access and manage your account and transaction efficiently.
            </p>
        </div>
    )
}

export default WelcomeBox