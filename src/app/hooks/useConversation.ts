import { useParams } from 'next/navigation';
import { useMemo } from 'react';

const useConversation = () => {
  const params = useParams();

  const conversationId = useMemo(() => {
    if (!params?.conversationId) {
      return '';
    }

    return params.conversationId as string;
  }, [params?.conversationId]);

  const isOpen = useMemo(() => !!conversationId, [conversationId]);
  // double exclamation points(!!) turns a string into a boolean

  return useMemo(
    () => ({
      isOpen,
      conversationId,
    }),
    [isOpen, conversationId]

    /*
        Including both 'isOpen' and 'conversationId' in the dependency array ensures that if 'isOpen' changes, 
        the component will recompute its value. This is useful if there are other factors besides 'conversationId'
        that could influence the value of 'isOpen'. It's a more defensive approach and may prevent potential bugs 
        if 'isOpen' depends on more than just 'conversationId'.

        However, since 'isOpen' directly depends on 'conversationId', including only 'conversationId' in the dependency array
        would suffice in this particular case. This is because whenever 'conversationId' changes, 'isOpen' will also
        change accordingly. In most cases, including all dependencies explicitly in the dependency array provides 
        better readability and reduces the chance of subtle bugs due to unexpected behavior caused by missing 
        dependencies. However, if you're absolutely certain that 'isOpe'n only depends on 'conversationId', 
        including only 'conversationId' would be more concise and may improve performance slightly. Although, React
        would throw a warning error.

    */
  );
};

export default useConversation;

/*
    'useMemo' is used when you need to memoize values.
     It's optimized for scenarios where you want to avoid re-computing expensive values on every render, 
     especially in situations where the computation might be costly.

     It returns a memoized value that only changes when one of the dependencies has changed.

     In the above code, 'useMemo' is used to memoize the value of 'conversationId' and 'isOpen'. 
     While the computation itself might not be computationally expensive, the purpose of using 'useMemo' here is to
     optimize the performance by preventing unnecessary recalculations of these values on every render

        
    If we used 'useCallback' instead of 'useMemo' in this scenario, it wouldn't be appropriate because 'useCallback'
    is primarily used to memoize functions, not values. While you technically could use 'useCallback' to memoize the
    derived values, it wouldn't be semantically correct and could lead to confusion for other developers reading the code.

    'useMemo' is specifically designed to memoize values based on dependencies, making it the appropriate choice for
     memoizing the derived values like 'conversationId' and 'isOpen'. It's important to choose the hook that best 
     fits the purpose and intention of your code to ensure clarity and maintainability.
*/
