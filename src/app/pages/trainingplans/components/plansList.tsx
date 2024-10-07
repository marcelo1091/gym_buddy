import { Divider, List, ListItem, ListItemButton, ListItemText } from "@mui/material"
import { useRouter } from "next/navigation";

type PlanListType = {
    id: string,
    planName: string
}

export const PlansList = ({ plans }: { plans: PlanListType[] }) => {
    const router = useRouter();
    return (
        <List>
            {plans.map(plan => (
                <div key={plan.id}>
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => router.push(`/pages/trainingplans/plan?id=${plan.id}`)}>
                            <ListItemText primary={plan.planName} />
                        </ListItemButton>
                    </ListItem>
                    <Divider />
                </div>
            ))}

        </List>
    )
}