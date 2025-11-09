import React, {useState} from 'react'
import { 
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogBody,
    AlertDialogBackdrop, } 
from '@/components/ui/alert-dialog'
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

interface CustomAlertDialogProps {
    alertHeading?: string;
    alertBody?: string;
    onClose?: () => void;
}

export function CustomAlertDialog({
    alertHeading = '',
    alertBody='', 
    onClose } : CustomAlertDialogProps){
    const [showAlertDialog, setShowAlertDialog] = useState(true);

    const handleClose = () => {
    setShowAlertDialog(false);
    if (onClose) onClose(); // notify parent
    };
    
    return(
        <>
            <AlertDialog isOpen={showAlertDialog} onClose={handleClose} size='lg'>
                <AlertDialogBackdrop />
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <Text className='text-lg font-bold text-center mb-2'>{alertHeading}</Text>
                    </AlertDialogHeader>
                    <AlertDialogBody>
                        <Text>{alertBody}</Text>
                    </AlertDialogBody>
                    <AlertDialogFooter className='mt-4'>
                        <Button variant="outline" onPress={handleClose}>
                            <ButtonText>Close</ButtonText>
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

