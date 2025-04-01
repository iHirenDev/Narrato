// A record for navigation parameters to pass between screens.

export type DrawerNavigatorParamList = {
    Home: undefined;
    Story: {
        storyData:{
            id: string;
            title: string;
            story: string;
            isFavorite: boolean;
            audio?:string;
            timestamp: string;
        }
    }
}

export type RootStackParamList = {
    DrawerNavigator: undefined;
    Story: {
        storyData:{
            id: string;
            title: string;
            story: string;
            isFavorite: boolean;
            audio?:string;
            timestamp: string;
        }
    }
}