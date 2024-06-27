"use client";
import CountUp from "react-countup"

const AnimatedCounter = ({ amount }: { amount: number }) => {
    return (
        <div>
            <CountUp
                prefix="$"
                decimals={2}
                end={amount}
                duration={1.75}
            />
        </div>
    )
}

export default AnimatedCounter