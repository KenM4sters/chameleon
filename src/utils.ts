/**
 * @brief Wrapper around any variable to ensure that it's passed by reference and not value.
 */
export class Ref<T> 
{
    constructor(public val : T) {};
};