import { Divider, IconButton, List, ListItem, ListItemButton, ListItemText } from "@mui/material"
import { useRouter } from "next/navigation";
import DeleteIcon from '@mui/icons-material/Delete';
import { removeFromDb } from "@/app/database/removeFromDb";
import { useState } from "react";
import { Loading } from "@/components/Loading/Loading";

type PlanListType = {
    id: string,
    planName: string
}

export const PlansList = ({ plans }: { plans: PlanListType[] }) => {
    const [removedIds, setRemovedIds] = useState<string[]>([])
    const [loading, setLoading] = useState(false)
    const router = useRouter();


    const removePlan = (id: string, event: React.MouseEvent) => {
        event.preventDefault()
        setLoading(true)

        removeFromDb({ collectionName: "training_plans", id })
            .then(() => { setLoading(false); console.log("success removed"); setRemovedIds(ids => [...ids, id]) })
            .catch((err: any) => { setLoading(false); console.error(err.message) })
    }



    return (
        <>
            <List>
                {plans.map(plan => (
                    !removedIds.includes(plan.id) && (
                        <div key={plan.id}>
                            <ListItem disablePadding style={{ minHeight: 48 }} secondaryAction={
                                <IconButton edge="end" aria-label="delete" onClick={(event) => removePlan(plan.id, event)}>
                                    <DeleteIcon color="error" />
                                </IconButton>
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