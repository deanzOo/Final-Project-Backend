export interface ISafeUser {
    id: number,
    phone: string,
    firstname?: string,
    lastname?: string,
    email?: string,
    session_key?: string,
    isAdmin?: boolean
}

export interface ISafeHyperparameters {
    id: number,
    batch_size: number,
    learning_rate: number,
    img_h: number,
    img_w: number,
    channels: number,
    use_bias: boolean,
    dropout_rate: number,
    epochs: number,
    conv_padding: number,
    latent_dim: number
}

export interface ISafeDataset {
    id: number,
    image_format: string,
    location: string,
    size: number,
    name: string,
}

export interface ISafeNeuralNetwork {
    id: number,
    name: string,
    hyperparameter_id: number,
    dataset_id: number,
}

export interface ISafeAuthData {
    user?: ISafeUser;
    session_key?: string
}

export interface ISafeUsersData {
    admins?: ISafeUser[],
    users?: ISafeUser[],
    admin?: ISafeUser,
    user?: ISafeUser
}

export interface ISafeHyperparametersData {
    hyperparameters?: ISafeHyperparameters | ISafeHyperparameters[]
}