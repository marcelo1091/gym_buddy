import { Button, Chip, Divider, IconButton, List, ListItem, ListItemButton, ListItemText } from "@mui/material"
import { useRouter } from "next/navigation";
import DeleteIcon from '@mui/icons-material/Delete';
import { removeFromDb } from "@/app/database/removeFromDb";
import { useEffect, useState } from "react";
import { Loading } from "@/components/Loading/Loading";
import { updateDb } from "@/app/database/updateDb";
import { getAuth } from "firebase/auth";

type PlanListType = {
    id: string,
    planName: string
    active: boolean
}

export const PlansList = ({ plans }: { plans: PlanListType[] }) => {
    const [removedIds, setRemovedIds] = useState<string[]>([])
    const [loading, setLoading] = useState(false)
    const [activePlan, setActivePlan] = useState("")
    const router = useRouter();
    const auth = getAuth();

    useEffect(() => {
        const activePlanId = plans.find(plan => plan.active)
        if (activePlanId) {
            setActivePlan(activePlanId.id)
        }
    }, [plans])

    const removePlan = (id: string, event: React.MouseEvent) => {
        event.preventDefault()
        setLoading(true)

        removeFromDb({ collectionName: "training_plans", id })
            .then(() => {
                setLoading(false); console.log("success removed"); setRemovedIds(ids => [...ids, id])
            })
            .catch((err: any) => {
                setLoading(false); console.error(err.message)
            })
    }

    const onActivePlan = (id: string, event: React.MouseEvent) => {
        event.preventDefault()

        if (activePlan) {
            updateDb({ collectionName: "training_plans", id: activePlan, data: { active: false } })
                .then(() => {
                    console.log("success")
                    setLoading(false)
                })
                .catch((err: any) => {
                    setLoading(false)
                    console.log(err.message)
                })
        }


        if (auth.currentUser) {
            updateDb({ collectionName: "training_plans", id: id, data: { active: true } })
                .then(() => {
                    console.log("success")
                    setLoading(false)
                    setActivePlan(id)
                })
                .catch((err: any) => {
                    setLoading(false)
                    console.log(err.message)
                })
        }
    }



    return (
        <>
            <List>
                {plans.map(plan => (
                    !removedIds.includes(plan.id) && (
                        <div key={plan.id}>
                            <ListItem disablePadding style={{ minHeight: 48 }} secondaryAction={
                                <>
                                    <IconButton edge="end">
                                        {activePlan === plan.id ? (
                                            <Chip label="Active Plan" color="success" variant="outlined" />
                                        ) : (
                                            <Button variant="text" onClick={(event) => onActivePlan(plan.id, event)}>
                                                Set Active
                                            </Button>
                                        )}
                                    </IconButton>
                                    <IconButton edge="end" aria-label="delete" onClick={(event) => removePlan(plan.id, event)}>
                                        <DeleteIcon color="error" />
                                    </IconButton>
                                </>
                            }>
                                <ListItemButton onClick={() => router.push(`/pages/trainingplans/plan?id=${plan.id}`)}>
                                    <ListItemText primary={plan.planName} style={{ width: "95%" }} />
                                </ListItemButton>

                            </ListItem>
                            <Divider />
                        </div>
                    )
                ))}
            </List>
            {loading && <Loading />}
        </>
    )
}