import {Table,Column,Model,DataType,Default} from 'sequelize-typescript'

@Table({
    tableName:'guitars'
})

class Guitar extends Model{
    @Column({
        type: DataType.CHAR(100)
    })
    name:string

    @Column({
        type: DataType.STRING
    })
    image: string

    @Column({
        type: DataType.TEXT
    })
    description: string

  @Column({
        type: DataType.DECIMAL(6, 2)
    })
    price: number
}


// id name price availability

export default Guitar