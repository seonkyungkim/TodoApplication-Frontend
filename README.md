# Web Development 101

React.js, 스프링 부트, AWS로 배우는 웹 개발 101

<aside>
💡 Todo Application: basic features → authentication login for users → AWS distribution
   - REST API: springboot, gradle, maven repository, lombok, JPA etc.
   - JWT: authentication 이론과 구현
   - AWS: 일라스틱 빈스톡(EC2, 오토스케일링 그룹, 로드밸런서, RDS etc.)
   - Route 53: DNS 등록 및 로드밸런서 연결

</aside>

---

# TODO List

<aside>
📌 **기능 요약**

- 리스트 생성/수정/출력/삭제, 회원가입, 로그인, 로그아웃

**배포할 애플리케이션의 아키텍처**

![Untitled](Web%20Development%20101%20467dc773b4bd4176892482d823f6cf72/Untitled.png)

</aside>

# 1. 개발 준비

### 1.1 사용할 기술들

- HTML/CSS/React.js
: 프론트엔드 애플리케이션 개발. 이 애플리케이션에는 프론트엔드 클라이언트를 반환하는 서버가 하나 있으며,  React.js 애플리케이션을 반환하는 역할 하나만을 수행한다. 이런 방식으로 프론트엔드와 백엔드를 분리(decouple)할 수 있다. 분리하는 이유에 대해서는 더 생각해보자.
- 스프링부트
: 백엔드 애플리케이션 개발. 프론트엔드 애플리케이션이 사용할 REST API를 스프링부트로 구현한다. 프로젝트를 확장하여 모바일 앱을 만들게 될 경우 별도의 백엔드 개발 없이 REST API를 사용할 수 있다. REST API를 구현하고 프론트엔드를 분리하면 마이크로서비스 아키텍처로 서비스를 확장하기 쉽다.
- AWS
: 프론트엔드와 백엔드 애플리케이션이 실행될 프로덕션 환경을 구축하는데 사용.

# 2. 백엔드 개발

### 2.1 백엔드 개발 환경

- 2.1.1 어노테이션
    
    
    | @SpringBootApplication | - 해당 클래스가 스프링부트를 설정하는 클래스임을 의미
    - 이 어노테이션이 달린 클래스가 있는 패키지를 베이스 패키지로 간주
    - @ComponentScan을 내부에 포함 |
    | --- | --- |
    | @Autowired | - 스프링이 베이스 패키지와 그 하위 패키지에서 자바Bean을 찾아 스프링의 의존성 주입 컨테이너 프로젝트인 ApplicationContext에 등록
    - 애플리케이션 실행 중 어떤 오브젝트가 필요한 경우 이 어노테이션이 의존하는 다른 오브젝트를 찾아 연결 |
    | @Component | - 스프링에게 이 클래스를 자바Bean으로 등록시키라고 알려줌
    - @Service도 내부에 이 어노테이션을 달고 있으며 @ComponentScan이 특정 클래스에 있어야 컴포넌트를 스캔할 수 있음
    - @SpringBootApplication에 포함되어 있는 어노테이션 |
- 2.1.2 어노테이션 작동 흐름
    1. 스프링부트 애플리케이션 시작
    2. @Component가 있는 경우 베이스 패키지와 그 하위패키지에서 @Component가 달린 클래스 찾기
    3. 필요한 경우 @Component가 달린 클래스의 오브젝트를 생성. 단, 생성하려는 오브젝트가 다른 오브젝트에 의존하는 경우(멤버 변수로 다른 클래스를 가진 경우), 그 멤버 변수 오브젝트를 찾아 넣어주어야 하는데 @Autowired를 사용하면 스프링이 자동으로 찾아 오브젝트를 생성해준다.
        1. @Autowired에 연결된 변수의 클래스가 @Compnent에 달린 클래스인 경우 스프링이 오브젝트를 생성해 넘겨줌
        2. @Bean으로 생성하는 오브젝트인 경우 @Bean이 달린 메서드를 불러 생성해 넘겨줌
- 2.1.3 프로젝트 실행여부 테스트
    1. IntelliJ의 우상단에 있는 버튼으로 Application 실행 → 아래 Run탭에 Spring이 출력되는지 확인
    2. 브라우저에서 localhost:8080으로 접근 → Whitelabel Error Page가 뜨는지 확인
- 2.1.4 포스트맨 API 테스트
    - 이 프로젝트에서 개발할 REST API를 테스트하기 위한 툴.
    - URI, HTTP 메서드, 요청 매개변수 또는 요청 바디 등을 일일이 브라우저에서 테스팅하기 힘들기 때문에 간단히 RESTful API를 테스트하고, 테스트를 저장해 API 스모크 테스팅 용으로 사용하기 위함.

### 2.2 백엔드 서비스 아키텍처

<aside>
📌 학습내용
    1. 레이어드 아키텍처 패턴
    2. REST 아키텍처 스타일
    3. 스프링 어노테이션
    4. JPA와 스프링 Data JPA
실습내용
    1. Model/Entity와 DTO클래스
    2. Controller, Service, Persistence 클래스
    3. 테스팅용 REST API

</aside>

- 2.2.1 Model, Entity, DTO
    - Model & Entity (TodoEntity.java)
        
        : 이 프로젝트에서는 둘을 한 클래스로 구현. 따라서 모델은 비즈니스 데이터를 담기도 하고 데이터베이스의 테이블과 스키마를 표현하는 역할을 하기도 한다.
        
    - DTO (TodoDTO.java, ResponseDTO.java)
        
        : 서비스가 요청을 처리하고 클라이언트로 반환할 때 모델 자체를 리턴하는 대신 DTO로 변환해 리턴
        
        1. 비즈니스 로직을 Encapsulation하기 위하여
        2. 클라이언트가 필요한 정보를 모델이 전부 포함하지 않는 경우가 많기 때문(Ex. 에러메시지)
- 2.2.2 REST API
    
    : REST 제약조건 → 만족하는 API는 RESTful API
    
    - 클라이언트 서버
        
        : 리소스를 관리하는 서버 - 클라이언트들은 네트워크를 통해 서버에 접근하여 리소스 소비
        
    - 상태가 없는
        
        : 클라이언트가 서버에 요청을 보낼 때 이전 요청의 영향을 받지 않는 상태를 의미한다.
        
        예를 들어, login페이지에서 로그인하여 다음 페이지로 이동하는 경우에 다음 페이지로 리소스를 불러올 때 이전 요청에서 로그인한 사실을 서버가 알고있어야 하는 경우는 상태가 있다. 따라서 서버가 로그인 상태를 유지하지 못하므로 요청을 보낼때마다 로그인 정보를 항상 함께 보내야 한다. 리소스 수정 후 상태를 유지시키기 위해서는 서버가 아닌 퍼시스턴스(데이터베이스 등)에 상태를 저장해야 한다.
        
    - 캐시되는 데이터
        
        : 리소스 리턴 시에 캐시가 가능한지 여부를 명시할 수 있어야 한다. (HTTP의 cache-control)
        
    - 일관적 인터페이스
        
        : 리소스에 접근하는 방식, 요청 형식, 응답 형식과 같은 URI, 요청의 형태와 응답의 형태가 애플리케이션 전반에 걸쳐 일관적이어야 한다.
        
    - 레이어 시스템
        
        : 클라이언트가 서버에 요청을 할 때 여러개의 레이어로 구성된 서버를 거칠 수 있으나, 클라이언트는 서버 레이어의 존재를 알지 못하며 요청과 응답에 어떤 영향을 미치지도 않는다.
        
    - 코드-온-디맨드(선택사항)
        
        : 클라이언트는 서버에 코드를 요청할 수도, 서버가 리턴한 코드를 실행할 수도 있다.
        
- 2.2.3 컨트롤러 레이어: 스프링 REST API 컨트롤러
    - TestController
        - @RequestMapping(”test”)는 URI경로에 매핑하고
        - @GetMapping은 HTTP Get 메서드에 매핑
        - 만약 RequestMapping(”test”)가 없다면 단순히 :8080/testGetMapping에 매핑됨
        - @PostMapping, @PutMapping, @DeleteMapping는 HTTP의 각 메서드에 연결
        
        ![Untitled](Web%20Development%20101%20467dc773b4bd4176892482d823f6cf72/Untitled%201.png)
        
    - Parameter를 넘겨받는 방법
        - @PathVariable
            
            :  **/{id}**와 같이 URI의 경로로 넘어오는 값을 변수로 받을 수 있다. (required = false)는 이 매개변수가 꼭 필요한 것은 아니라는 의미
            
        - @RequestParam
            
            : **?id={id}**와 같이 요청 매개변수로 넘어오는 값을 변수로 받을 수 있다.
            
        - @RequestBody
            
             : 여러 데이터의 묶음처럼 복잡한 리소스를 반환할 때 사용하며, 데이터를 담아 보낼 testRequestBodyDTO가 필요하다.
            RequestBody로 보내오는 JSON{”id”:123, “message”:”Hello World”}을 DTO오브젝트로 변환해 가져온다. 따라서 클라이언트가 요청 바디로 JSON형태의 문자열을 넘겨줄 때 DTO의 id, message 형태로 구성되어 있어야 한다. 
            
        - @ResponseBody
            
            : 문자열보다 복잡한 오브젝트를 리턴할 때 사용하며, 요청을 통해 오브젝트를 가져올 수 있는데 응답으로 오브젝트를 리턴할 수 있다.
            
            - 직렬화(Serialization)
            : @RestController는 크게 @Controller @ResponseBody라는 두 어노테이션의 조합으로 이뤄져 있다. @Controller는 @Component로 스프링이 이 클래스의 오브젝트를 알아서 생성하고 다른 오브젝트들과의 의존성을 연결한다는 의미이고, @ResponseBody는 이 클래스의 메서드가 리턴하는 것이 웹 서비스의 ResponseBody라는 의미이다.
             즉, 메서드가 리턴할 때 스프링은 리턴된 오브젝트를 JSON의 형태로 바꾸고 HttpResponse에 담아 반환한다. 이처럼 오브젝트를 저장하거나 네트워크를 통해 전달할 수 있도록 변환하는 것을 직렬화라고 한다.
        - @ResponseEntity
            
            : Http응답의 바디뿐만 아니라 다른 매개변수들(status 또는 header)을 조작할 때 사용
            ResponseBody와 비교하면 리턴된 바디에는 아무 차이가 없으나, 단지 헤더와 HTTP status를 조작할 수 있다는 점이 다르다.
            
- 2.2.4 서비스 레이어: 비즈니스 로직
    
    : Controller와 Persistence 사이에서 비즈니스 로직을 수행하며, 양쪽 모두와 분리되어 있어 로직에 집중할 수 있다.
    
    - TodoService
        
        : 스테레오타입 어노테이션인 @Service를 사용하여 해당 클래스가 스프링 컴포넌트이며 기능적으로는 비즈니스 로직을 수행하는 서비스 레이어임을 알려둔다.
        
    - TodoController
        - @RestController도 내부에 @Component를 가지고 있으므로, @Service, @RestController 모두 스프링이 관리하는 자바빈에 해당한다.
        - 스프링이 TodoController를 생성할 때 내부에 @Autowired가 있음을 확인하면, 이 어노테이션이 알아서 빈을 찾은 뒤 그 빈을 인스턴스 멤버 변수에 연결한다.
        - 따라서 TodoController를 초기화할 때 스프링은 알아서 TodoService를 초기화하거나 검색해서 TodoController에 주입해준다.
        - TodoController.java
        
        ```java
        @RestController
        @RequestMapping("todo")
        public class TodoController{
        
        		@Autowired  
            private TodoService service;
        
            @GetMapping("/test")
        		public ResponseEntity<?>testTodo(){
        				//리턴값 "Test Service"를 str변수에 담음
        				String str = service.testService(); 
        
        				//새로운 어레이리스트 list를 생성
        		    List<String>list = new ArrayList<>();
        				// list에 str변수에 담긴 값을, err에 문자열 "err" 넣음
                list.add(str);                      
                String err = "err";
        
                //ResponseDTO를 제너릭으로 작성했으므로 <String>형으로 쓰겠다고 알림
                //<String>형으로 builder를 사용하고 -> error값에 문자열 "err"를, data값에 앞서 담아둔 문자열 리스트 list를 넣은 뒤 -> 빌드
                ResponseDTO<String>response = ResponseDTO.<String>builder().error(err).data(list).build();
        
                // { "error" : "err", "data" : ["Test Service"] }가 출력된다.
                return ResponseEntity.ok().body(response);
        		}
        }
        ```
        
- 2.2.5 퍼시스턴스 레이어: 스프링 데이터 JPA
    
    : JDBC 드라이버는 자바에서 데이터베이스에 연결할 수 있도록 도와주는 라이브러리다. 
    
    - ORM과 DAO클래스
    : 데이터베이스 콜 스니펫을 살펴보면 JDBC는 Connection을 이용해 데이터베이스에 연결하고 sqlSelectAllTodos에 작성된 SQL을 실행한 후 ResultSet이라는 클래스에 결과를 담아온 뒤 while문 내부에서 ResultSet을 Todo오브젝트로 바꿔준다. 이 일련의 과정을 ORM이라고 하며, 이 작업은 엔티티마다 해주어야 하므로 데이터베이스의 각 테이블마다 엔티티 클래스가 하나씩 매핑되어 존재한다. DAO는 생성/수정/삭제와 같은 기본적인 기능들을 엔티티마다 작성해주는데, 이런 반복작업을 줄이기 위해 ORM프레임워크(Hibernate)나 JPA, 스프링데이터 JPA를 사용하기도 한다.
        
        ![Untitled](Web%20Development%20101%20467dc773b4bd4176892482d823f6cf72/Untitled%202.png)
        
    - JPA(Hibernate, JPA Repository)
    : 반복해서 데이터베이스 쿼리를 보내 ResultSet을 파싱해야 하는 작업을 줄여준다. JPA는 스펙으로, 구현을 위해 특정 기능을 작성하라고 알려주는 지침과 같다. 자바에서 데이터베이스 접근, 저장, 관리에 필요한 스펙이 명시한대로 동작한다면 그 내부 구현 사항은 구현자의 마음이다. 스프링 데이터 JPA는 JPA를 추상화하여 사용하기 쉽게 도와주는 스프링 프로젝트다.
        - JPA Repository
            
            : 기본적인 데이터베이스 오퍼레이션 인터페이스를 제공하며 주로 상속받아 사용한다. save, findById, findAll와 같은 메서드가 스프링데이터JPA 실행시에 자동으로 구현되므로 sql 쿼리를 일일이 작성할 필요가 없다. 
            
    - H2 Database
        
        : In-Memory 데이터베이스로 로컬 환경에서 메모리상에 데이터베이스를 구축한다. H2는 따로 데이터베이스 서버를 구축하지 않아도 되기때문에 초기 개발시에 주로 사용한다. 애플리케이션 실행시 테이블이 생성되었다가 종료시에 테이블이 함께 소멸되고, @SpringBootApplication이 알아서 애플리케이션을 H2 데이터베이스에 연결한다.
        
    - TodoEntity.java
        - 데이터베이스 테이블마다 그에 상응하는 엔티티 클래스가 존재하며, 하나의 엔티티 인스턴스는 데이터베이스 테이블의 한 행에 해당한다. 엔티티 클래스는 ORM이 엔티티를 보고 어떤 테이블의 어떤 필드에 매핑해야 하는지 알 수 있도록 작성한다. 자바 클래스를 엔티티로 정의할 때 1. 클래스에 noArgsConstructor가 필요하다는 것과 2. Getter/Setter가 필요하다는 두 가지를 유의해야 한다.
        - @GeneratedValue와 @GenericGenerator
        : @GeneratedValue는 ID를 자동으로 생성하겠다는 뜻이며 매개변수인 generator로 ID 생성방식을 지정한다. @GenericGenerator는 Hibernate가 제공하는 기본 제너레이터 대신 새로 정의하고 싶은 경우에 사용하며 기본 제너레이터 값으로는 INCREMENTAL, SEQUENCE, IDENTITY가 있다. 프로젝트에서는 문자열 형태의 UUID 사용을 위해 system-uuid라는 이름의 커스텀 제너레이터를 만든 것이고, 이렇게 만든 제너레이터를 @GeneratedValue가 참조해 사용한다.
    - TodoRepository.java
        
        : 퍼시스턴스를 관리하는 패키지를 만들고 그 아래에 TodoRepository 인터페이스를 생성한다. JpaRepository를 확장받아 작성하며 JpaRepository<T,ID>에서 T는 엔티티클래스를 ID는 엔티티 기본키의 타입이다. 따라서 이 프로젝트에서는 JpaRepository<TodoEntity, String>이 된다.
        

### 2.3 백엔드 서비스 개발

- 2.3.1 Create Todo 구현
    1. 퍼시스턴스 → TodoRepository.java
    : 퍼시스턴스로는 JpaRepository를 상속하는 TodoRepository를 사용한다. 엔티티 저장에는 save를, 새 Todo리스트 반환에는 앞서 구현해둔 findByUserId() 메서드를 사용한다.
    2. 서비스 → TodoService의 *validate*
        - 검증(Validation): 넘어온 엔티티가 유효한지 검사하는 로직.  TodoValidator로 분리가능.
        - save(): 엔티티를 데이터베이스에 저장하고 로그를 남긴다.
        - findByUserId(): 저장된 엔티티를 포함하는 새 리스트를 리턴한다.
    3. 컨트롤러 → TodoDTO의 *toEntity,* TodoController의  *createTodo*
        
        : HTTP 응답을 반환할 때 비즈니스 로직을 캡슐화하거나 추가적인 정보를 함께 반환하기 위해 DTO를 사용한다. 따라서 컨트롤러는 사용자에게서 TodoDTO를 요청바디로 넘겨받고 이를 TodoEntity로 변환하여 저장해야 하며, TodoService의 create()가 리턴하는 TodoEntity를 TodoDTO로 변환해 리턴해야 한다.
        
- 2.3.2 Retrieve Todo 구현
    1. 퍼시스턴스 → 동일
    2. 서비스 → TodoService의 *retrieve*
    3. 컨트롤러 → TodoController의 *retrieveTodoList*
- 2.3.3 Update Tool 구현
    1. 퍼시스턴스 → 동일
    2. 서비스 → TodoService의 *update*
    3. 컨트롤러 → TodoController의 *updateTodo*
- 2.3.4 Delete Tool 구현
    1. 퍼시스턴스
    2. 서비스 → TodoService의 *delete*
    3. 컨트롤러 → TodoController의 *deleteTodo*
- 2.3.5 Postman을 이용한 테스트
    
    : [localhost:8080/todo](http://localhost:8080/todo)에서 POST - GET - PUT - GET - DELETE 순으로 테스트
    
    1. POST (create메서드) : 간단히 title 값을 JSON형태로 준다.
    2. GET (retrieve메서드) : 포스팅한 title 값과 id, done값이 모두 출력되는지 확인.
    3. PUT (update메서드) : title, id, done 값 모두를 JSON형태로 준다.
    4. DELETE (delete메서드) : 요청바디로 id만 명시해준다. 바디 전체를 보내도 상관은 없음.
    

# 3. 프론트엔드 개발

### 3.1 프론트엔드 개발 환경

- 3.1.1 Node.js와 NPM
    
    
    | Node.js | 자바스크립트를 컴퓨터 내에서 실행할 수 있게 해주는 자바스크립트 런타임 환경이다. 자바스크립트로 된 node서버를 이용해 구축한 프론트엔드 서버는 단순히 요청이 왔을 때 HTML, Javascript, CSS를 리턴한다. |
    | --- | --- |
    | NPM | Node.js의 패키지 관리 시스템. |
- 3.1.2 프론트엔드 애플리케이션 생성
    - IntelliJ에서 새로운 React 프로젝트 생성
    - Node.js, npm, material-ui 패키지 설치
- 3.1.3 브라우저 동작 원리
    - 파싱
        1. 브라우저가 HTML을 트리 자료구조 형태인 DOM 트리로 변환한다.
        2. 다운해야 하는 리소스들(image, css, script 등)을 다운한다. CSS의 경우 추가로 CSSOM 트리로 변환한다.
        3. 다운받은 자바스크립트를 interpret, compile, parsing하고 실행한다.
    - 렌더링
        1. DOM트리(내용)와 CSSOM트리(디자인)를 합쳐 렌더 트리를 만든다.
        2. 레이아웃을 정한다. (트리의 각 노드가 어디에 배치될지)
        3. 사용자가 시각화된 HTML 파일을 볼 수 있도록 브라우저 스크린에 렌더 트리의 각 노드를 그린다. 
- 3.1.4 React.js
    - SPA(Single Page Application)
    : 한 번 웹페이지를 로딩하면 사용자가 새로고침하지 않는 한 새로 로딩하지 않는 애플리케이션. 
    HTML이 <body></body>를 렌더링하다보면 마지막에 index.js를 포함하고 있는 bundle.js라는 스크립트를 로딩하게 된다. index.js 내부의 ReactDom.render() 함수가 실행되면서 동적으로 HTML 엘리먼트를 리액트 첫 화면으로 시각화하는 것이다. (렌더링된 하위 엘리먼트는 render()함수의 매개변수로 들어가는 <App />부분이다.) 따라서, 페이지를 바꾸고 싶다면 root의 하위 엘리먼트를 다른 HTML로 수정하면 된다. 브라우저의 자바스크립트는 fetch, ajax로 서버에 데이터를 요청하고 받은 데이터로 HTML을 구성하기 때문이다. 이렇게 서버에게 새 페이지를 요청하는 대신 자바스크립트가 동적으로 HTML을 재구성해 만드는 클라이언트 애플리케이션을 SAP라고 하고, 이 렌더링 과정을 Client-Side Rendering이라고 한다.
    - React Component
        
        : App Component를 렌더링하기 위해서는 ReactDOM.render()에 매개변수로 <App />을 주면 된다. ReactDOM은 매개변수로 넘겨받은 <App />컴포넌트를 이용하여 DOM 트리를 만드는데 이때 컴포넌트의 render()함수가 반환한 JSX를 렌더링한다.
        
        - index.js의 App 렌더링
            
            ```jsx
            import React from 'react';      //리액트의 사용을 위해 import
            import ReactDOM from 'react-dom';       //리액트 DOM의 사용을 위해
            import './index.css';                   //css import
            import App from './App';                //App Component import
            import reportWebVitals from './reportWebVitals';
            
            ReactDOM.render(    //ReactDOM내부의 컴포넌트들을 'root' 엘리먼트에 rendering
              <React.StrictMode>
                <App />
              </React.StrictMode>,
              document.getElementById('root')
            );
            ```
            
            1. import를 이용해 App 컴포넌트를 불러온다.
            2. <컴포넌트이름 />을 이용해 컴포넌트를 사용한다.
            
            ReactDOM.render는 첫번째 매개변수로 리액트 컴포넌트를 받고, 두번째로는 root 엘리먼트를 받는다. 이는 index.html에 정의되어 있는 root 엘리먼트 아래에 첫번째 매개변수를 추가하라는 의미이다. React로 만든 모든 컴포넌트는 이 root 엘리먼트 하위에 추가된다.
            
            ![Untitled](Web%20Development%20101%20467dc773b4bd4176892482d823f6cf72/Untitled%203.png)
            
    

### 3.2 프론트엔드 서비스 개발

- 3.2.1 Todo 리스트
    
    : App.js, Todo.js 작성. 주석 참고.
    
    ![Untitled](Web%20Development%20101%20467dc773b4bd4176892482d823f6cf72/Untitled%204.png)
    
- 3.2.2 Add 핸들러 추가
    - onInputChange
    : 사용자가 input 필드에 키를 하나 입력할 때마다 실행. input 필드에 담긴 문자열을 자바스크립트 오브젝트에 저장.
        
        ```jsx
        //(1)함수 작성
        onInputChange = (e) => {
            const thisItem = this.state.item;
            thisItem.title = e.target.value;
            this.setState({item: thisItem});
            console.log(thisItem);
        }
        ```
        
        이벤트가 발생해 onChange에 연결된 onInputChange가 실행되면 이벤트 오브젝트인 e가 매개변수로 넘어온다. 이 오브젝트의 target.value에는 현재 화면의 InputField에 입력된 글자들이 담겨있다. 따라서 e.target.value를 item의 title로 지정한 뒤 setState를 통해 item을 업데이트하여 사용자의 Todo 아이템을 임시로 저장한다.
        
        ```jsx
        <TextField
            placeholder="Add Todo here"
            fullWidth
            onChange={this.onInputChange}
            value={this.state.item.title}
        />
        ```
        
        onInputChange함수를 TextField의 onChcnage props로 넘기는 작업을 해주면, TextField에 사용자 입력이 들어올 때마다 함수가 실행된다. 
        
    - onButtonClick ( Add 핸들러 )
    : 사용자가 + 버튼을 클릭할 때 실행. onInputChange에서 저장하고 있던 문자열을 리스트에 추가
        
        ![Untitled](Web%20Development%20101%20467dc773b4bd4176892482d823f6cf72/Untitled%205.png)
        
        AddTodo컴포넌트는 상위 컴포넌트(App)의 items에 접근할 수 없다. 따라서 리스트에 추가하는 add 함수는 App컴포넌트에 추가하고, 해당 함수를 AddTodo의 프로퍼티로 넘겨 AddTodo에서 사용한다. AddTodo컴포넌트에서 add를 props로 넘겨받아 onButtonClick에서 사용한다.
        
    - enterKeyEventHandler ( 엔터키 입력시 아이템 추가 )
    : 사용자가 input 필드상에서 엔터 또는 리턴키를 눌렀을 때 실행되며 기능은 onButtonClick과 같다.
        
        AddTodo컴포넌트 내부에 enterKeyEventHandler는 키보드의 키 이벤트 발생 시 항상 실행된다. 이벤트가 Enter키로 발생된 경우 onButtonClick을 실행하면 된다. 그런 다음 작성한 함수를 TextField컴포넌트에 onKeyPress={this.eventKeyEventHandler}로 연결시켜주면 된다. 
        
- 3.2.3 Todo 삭제
    
    : 각 리스트 아이템의 오른쪽에 삭제아이콘을 추가하고, 버튼이 클릭되면 아이템이 삭제된다. 아이콘은 material ui의 ListItemSecondaryAction과 IconButton컴포넌트를 사용한다.
    
    - delete함수를 App.js에 추가 작성
        
        : 기존 items에서 매개변수로 넘어온 item을 제외한 items(newItems변수)를 state에 저장하는 것이다. 매개변수로 넘어온 item을 제외하려고 filter 함수를 사용했고 id를 비교해 item과 id가 같은 경우 제외하는 로직을 작성했다.
        
    - delete함수를 Todo컴포넌트에 연결
        
        ```
        constructor(props) {
            super(props);       //props 오브젝트 초기화
            this.state={item: props.item};  //this.state를 item변수와 props.item으로 초기화한다.
            this.delete=props.delete;
        }
        
        deleteEventHandler = () => {
            this.delete(this.state.item)
        }
        
        ```
        
        Todo에는 아직 delete가 없으므로 Todo.js의 생성자 부분에 this.delete = props.delete를 추가하여 함수를 연결하고, deleteEventHandler 함수를 추가한다. 또 render 함수 안쪽에 deleteEventHandler를 연결하는 코드를 추가로 작성해준다.
        
- 3.2.4 Todo 수정
    - [ ]  체크박스에 체크하는 경우 → 클릭 시 item.done의 값을 변경
        - checkbox 업데이트 기능
            
            : done을 true→false, false→true로 변경해준다.
            
            1. Todo.js에서 checkboxEventHandler 작성
            2. Todo.js에서 onChange에 checkboxEventHandler 연결
    - 타이틀을 변경하고 싶은 경우
        1. Todo 컴포넌트에 readOnly플래그를 두고 true인 경우 수정이 불가능하고 false인 경우 아이템을 수정할 수 있다.
        2. 사용자가 title을 클릭하면 해당 input field가 수정가능한 상태가 된다. (readOnly false)
        3. 사용자가 Enter키를 누르면 readOnly가 true인 상태로 전환된다.
        4. 체크박스 클릭 시 item.done값을 다른 상태로 전환한다.
        - 구현하기
            1. Todo.js에서 ReadOnly상태변수 추가
            2. Todo.js에서 offReadOnlyMode() 추가
            3. readOnly와 offReadOnlyMode 연결
            4. Enter를 누르면 ReadOnly모드를 종료하는 이벤트핸들러
    - Item 수정 함수
        
        : AddTodo 컴포넌트와 같이 사용자가 키보드를 입력할 때마다 item을 새 값으로 변경해주어야 함.
        
        - Todo에서 editEventHandler 작성
        - Todo에서 onChange에 editEventHandler 연결
    

### 3.3 서비스 통합

: 현재까지 각각 개별적으로 동작하는 백엔드/프론트엔드 애플리케이션을 구현했다. 지금부터는 자바스크립트의 fetch API를 사용하여 프론트엔드에서 백엔드에 API를 요청하는 코드를 작성해본다.

- 3.3.1 componentDidMount
    
    : Todo아이템을 불러오는 부분이다. 마운팅이란 렌더링 초기 과정에서 즉, ReactDOM 트리가 존재하지 않는 상태에서 리액트가 처음으로 각 컴포넌트의 render()함수를 호출하여 자신의 DOM트리를 구성하는 과정을 의미한다. 마운팅 과정에서는 생성자와 render()함수를 호출하고 마운팅을 마친 뒤에 호출하는 함수는 componentDidMount이다. 컴포넌트가 렌더링 되자마자 API 콜을 하고 그 결과를 리스트로 보여주기 위해 componentDidMount 함수에 백엔드 API콜 부분을 구현할 것이다.
    
- 3.3.2 CORS(Cross-Origin Resource Sharing)
    
    : 처음 리소스를 제공한 도메인이 현재 요청하려는 도메인과 다르더라도 요청을 허락해주는 웹 보안 방침이다. componentDidMount 함수의 fetch 부분에서 http://localhost:8080으로 2개의 새 요청을 보낸다. 첫 번째 요청은 OPTIONS 메서드를 사용한다. 이 메서드는 보통 리소스에 대해 어떤 HTTP 메서드를 사용할 수 있는지 확인하고 싶을 때 보낸다. 요청이 반환되고 CORS여부와 GET 요청 사용가능 여부를 확인하면 두 번째 요청으로 우리가 원래 보내려고 했던 요청을 보낸다.
    
- 3.3.3 fetch
    - 자바스크립트 Promise
        
        : 자바스크립트의 싱글스레드 환경을 극복하기 위해 HTTP요청을 XMLHttpRequest같은 Web API로 보내는 과정에서 발생할 수 있는 콜백 지옥(Callback Hell)을 피하게 해 준다. Promise는 이 함수를 시행한 뒤 오브젝트에 명시된 사항들을 실행시켜주겠다는 일종의 약속이다. Promise에는 Pending(오퍼레이션이 끝나길 기다리는 상태), Resolve(오퍼레이션의 성공적인 종료를 알리고 원하는 값을 전달), Rejecte(오퍼레이션 중 에러가 나는 경우) 상태가 있다.
        
    - Fetch API
        
        : 자바스크립트가 제공하는 메서드로 API 서버로 http요청을 송신하거나 수신할 수 있도록 돕는다. url을 매개변수로 받거나, url과 options를 매개변수로 받을 수 있다. fetch()함수는 Promise 오브젝트를 리턴하므로, then과 catch에 콜백 함수를 전달해 응답을 처리할 수 있다.
        
        - 프론트엔드 프로젝트에서 src > app-config.js와 src > service > ApiService.js 생성
        - ApiService에서 작성한 call 메서드를 App 컴포넌트에서 사용할 수 있도록 코드 변경
        
        이제 브라우저를 새로 고침하거나 프론트엔드 애플리케이션을 재시작해도 기존의 Todo리스트가 사라지지 않는다. 백엔드의 데이터베이스에서 Todo 리스트를 가져오도록 코드를 수정했기 때문이다. 
        
    - Todo Update 수정
        
        : 지금까지는 mock()함수를 사용하여 사용자 입력이 발생하면 editEventHandler가 title을 수정해주었으나, API를 이용하여 업데이트하려면 Service API를 이용하여 서버데이터를 업데이트한 뒤 변경된 내용을 다시 화면에 출력하는 과정이 필요하다.
        
        - App 컴포넌트에 update()함수를 구현하고 Todo의 props에 연결
        - Todo 컴포넌트에서 update 연결하여 사용
        - 테스트 - 업데이트시 PUT 메서드를 이용하는 HTTP 리퀘스트 사용했는지 확인 → 성공
            
            ![Untitled](Web%20Development%20101%20467dc773b4bd4176892482d823f6cf72/Untitled%206.png)
            
            ![Untitled](Web%20Development%20101%20467dc773b4bd4176892482d823f6cf72/Untitled%207.png)
            

# 4. 인증 백엔드 통합

# 5. 인증 프론트엔드 통합

# 6. 프로덕션 배포